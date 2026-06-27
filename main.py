from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from browser import scan_website
from wcag import check_wcag 
from scorer import calculate_score
from fix_gen import generate_fixes 
from heuristic import check_heuristics 
from dom_check import check_dom

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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