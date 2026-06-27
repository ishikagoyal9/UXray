from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from browser import scan_website
from wcag import check_wcag
from scorer import calculate_score
from fix_gen import generate_fixes
from heuristic import check_heuristics
from dom_check import check_dom
from chat import get_chat_response   
from pydantic import BaseModel        

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Chat request model
class ChatRequest(BaseModel):
    question: str
    url: str
    final_score: int
    grade: str
    wcag_total: int
    heuristic_total: int
    dom_total: int
    critical: int
    high: int
    medium: int
    low: int

@app.get("/")
def home():
    return {"message": "UXray Backend Running!"}

@app.get("/scan")
def scan(url: str):
    browser_result = scan_website(url)
    if not browser_result["success"]:
        return browser_result

    wcag_result = check_wcag(
        browser_result["html"],
        browser_result.get("css_colors", [])
    )
    heuristic_result = check_heuristics(browser_result["html"])
    dom_result = check_dom(browser_result["html"])

    score_result = calculate_score(
        wcag_result["issues"],
        heuristic_result["heuristic_score"],
        dom_result["dom_score"]
    )

    fixes = generate_fixes(
        wcag_result["issues"],
        heuristic_result["issues"],
        dom_result["issues"]
    )

    return {
        "success": True,
        "url": url,
        "title": browser_result["title"],
        "screenshot": browser_result["screenshot"],
        "score": score_result,
        "wcag": wcag_result,
        "heuristic": heuristic_result,
        "dom": dom_result,
        "fixes": fixes
    }

@app.post("/chat")
def chat(req: ChatRequest):
    audit_context = {
        "url": req.url,
        "final_score": req.final_score,
        "grade": req.grade,
        "wcag_total": req.wcag_total,
        "heuristic_total": req.heuristic_total,
        "dom_total": req.dom_total,
        "critical": req.critical,
        "high": req.high,
        "medium": req.medium,
        "low": req.low
    }
    result = get_chat_response(req.question, audit_context)
    return result