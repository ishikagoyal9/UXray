import sys
import asyncio
import base64
import json
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

if sys.platform.startswith("win"):
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from browser import scan_website
from wcag import check_wcag
from scorer import calculate_score
from fix_gen import generate_fixes
from heuristic import check_heuristics
from dom_check import check_dom
from chat import get_chat_response
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
REPORTS_DIR = BASE_DIR / "reports"
SCREENSHOTS_DIR = BASE_DIR / "screenshots"
REPORTS_DIR.mkdir(exist_ok=True)
SCREENSHOTS_DIR.mkdir(exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/screenshots", StaticFiles(directory=str(SCREENSHOTS_DIR)), name="screenshots")

class ChatRequest(BaseModel):
    question: str
    url: str = ""
    final_score: int = 0
    grade: str = ""
    wcag_score: int = 0
    heuristic_score: int = 0
    dom_score: int = 0
    wcag_total: int = 0
    heuristic_total: int = 0
    dom_total: int = 0
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0
    issues_summary: Optional[str] = None

@app.get("/")
def home():
    return {"message": "UXray Backend Running!"}


def _safe_slug(value: str) -> str:
    value = re.sub(r"^https?://", "", value or "site", flags=re.I)
    value = re.sub(r"[^a-zA-Z0-9._-]+", "-", value).strip("-._")
    return (value or "site")[:60]


def _save_base64_png(data: str, report_id: str, name: str) -> str:
    if not data:
        return ""
    if data.startswith("data:"):
        data = data.split(",", 1)[-1]
    filename = f"{report_id}-{_safe_slug(name)}.png"
    path = SCREENSHOTS_DIR / filename
    try:
        path.write_bytes(base64.b64decode(data))
        return f"/screenshots/{filename}"
    except Exception:
        return ""


def _with_page(issue: dict, page: dict) -> dict:
    enriched = dict(issue)
    # enriched["page_url"] = page.get("url", "")
    # enriched["page_title"] = page.get("title", "")
    # enriched["screenshot"] = page.get("screenshot_url", "") or page.get("screenshot", "")
    enriched["page_url"] = page.get("url", "")
    enriched["page_title"] = page.get("title", "")
    enriched["page_type"] = page.get("page_type", "Home")
    enriched["page_index"] = page.get("page_index", 0)

    enriched["screenshot"] = page.get("screenshot_url", "")

    enriched["issue_id"] = str(uuid.uuid4())
    return enriched


def _report_file(report_id: str) -> Path:
    return REPORTS_DIR / f"{report_id}.json"


def _load_report(report_id: str) -> dict | None:
    path = _report_file(report_id)
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def _summary(report: dict) -> dict:
    score = report.get("score", {})
    return {
        "id": report.get("id"),
        "url": report.get("url"),
        "title": report.get("title", ""),
        "saved_at": report.get("saved_at"),
        "screenshot": report.get("screenshot", ""),
        "score": score,
        "wcag": {"total_issues": report.get("wcag", {}).get("total_issues", 0), "issues": []},
        "heuristic": {"total_issues": report.get("heuristic", {}).get("total_issues", 0), "heuristic_score": report.get("heuristic", {}).get("heuristic_score", 0), "issues": []},
        "dom": {"total_issues": report.get("dom", {}).get("total_issues", 0), "dom_score": report.get("dom", {}).get("dom_score", 0), "issues": []},
        "success": True,
    }

@app.get("/reports")
def list_reports():
    reports = []
    for path in sorted(REPORTS_DIR.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True):
        report = _load_report(path.stem)
        if report:
            reports.append(report)
    return {"success": True, "reports": reports}

@app.get("/reports/latest")
def latest_report():
    reports = list_reports()["reports"]
    if not reports:
        raise HTTPException(status_code=404, detail="No reports yet")
    report = _load_report(reports[0]["id"])
    return report

@app.get("/reports/{report_id}")
def get_report(report_id: str):
    report = _load_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@app.get("/scan")
async def scan(url: str):
    browser_result = await scan_website(url)
    if not browser_result.get("success"):
        return browser_result

    report_id = f"report_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"
    pages = browser_result.get("pages") or [browser_result]

    for index, page in enumerate(pages):
        page_name = f"page-{index + 1}-{page.get('url', url)}"
        screenshot_url = _save_base64_png(page.get("screenshot", ""), report_id, page_name)
        page["screenshot_url"] = screenshot_url
        page["screenshot"] = screenshot_url
        page["page_index"] = index
        page["page_type"] = page.get("page_type", f"Page {index+1}")
    browser_result["screenshot"] = pages[0].get("screenshot_url", "") if pages else ""

    all_wcag_issues = []
    all_heuristic_issues = []
    all_dom_issues = []
    heuristic_scores = []
    dom_scores = []

    for page in pages:
        html = page.get("html", "")
        wcag_result = check_wcag(html, page.get("css_colors", []))
        heuristic_result = check_heuristics(html)
        dom_result = check_dom(html)

        all_wcag_issues.extend(_with_page(issue, page) for issue in wcag_result.get("issues", []))
        all_heuristic_issues.extend(_with_page(issue, page) for issue in heuristic_result.get("issues", []))
        all_dom_issues.extend(_with_page(issue, page) for issue in dom_result.get("issues", []))
        heuristic_scores.append(heuristic_result.get("heuristic_score", 0))
        dom_scores.append(dom_result.get("dom_score", 0))

    heuristic_score = round(sum(heuristic_scores) / len(heuristic_scores)) if heuristic_scores else 0
    dom_score = round(sum(dom_scores) / len(dom_scores)) if dom_scores else 0

    heuristic_result = {"issues": all_heuristic_issues, "heuristic_score": heuristic_score, "total_issues": len(all_heuristic_issues)}
    dom_result = {"issues": all_dom_issues, "dom_score": dom_score, "total_issues": len(all_dom_issues)}
    wcag_result = {"issues": all_wcag_issues, "total_issues": len(all_wcag_issues)}
    score_result = calculate_score(all_wcag_issues, heuristic_score, dom_score)
    fixes = generate_fixes(all_wcag_issues, all_heuristic_issues, all_dom_issues)

    report = {
        "success": True,
        "id": report_id,
        "saved_at": datetime.now(timezone.utc).isoformat(),
        "url": url,
        "title": browser_result.get("title", ""),
        "screenshot": browser_result.get("screenshot", ""),
        # "pages": [{"url": p.get("url", ""), "title": p.get("title", ""), "screenshot": p.get("screenshot_url", "")} for p in pages],
        "pages": [
    {
        "id": idx,
        "url": p.get("url", ""),
        "title": p.get("title", ""),
        "page_type": p.get("page_type", ""),
        "page_index": p.get("page_index", idx),
        "screenshot": p.get("screenshot_url", "")
    }
    for idx, p in enumerate(pages)
],

"pages_crawled": len(pages),
        "score": score_result,
        "wcag": wcag_result,
        "heuristic": heuristic_result,
        "dom": dom_result,
        "fixes": fixes,
    }

    _report_file(report_id).write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("\n" + "=" * 60)
    print("SCAN COMPLETE")
    print(f"Report ID      : {report_id}")
    print(f"Pages Crawled  : {len(pages)}")

    for p in pages:
        print(
            f"{p.get('page_type', 'Page')} -> {p.get('url', '')}"
        )

    print("=" * 60 + "\n")

    return report

@app.post("/chat")
def chat(req: ChatRequest):
    audit_context = {
        "url": req.url,
        "final_score": req.final_score,
        "grade": req.grade,
        "wcag_score": req.wcag_score,
        "heuristic_score": req.heuristic_score,
        "dom_score": req.dom_score,
        "wcag_total": req.wcag_total,
        "heuristic_total": req.heuristic_total,
        "dom_total": req.dom_total,
        "critical": req.critical,
        "high": req.high,
        "medium": req.medium,
        "low": req.low,
        "issues_summary": req.issues_summary or ""
    }
    return get_chat_response(req.question, audit_context)