from playwright.sync_api import sync_playwright

def scan_website(url: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 720}
        )
        
        page = context.new_page()
        
        try:
            page.goto(
                url,
                wait_until="domcontentloaded",  # networkidle se badla
                timeout=30000
            )
            
            html = page.content()
            title = page.title()
            
            return {
                "success": True,
                "url": url,
                "title": title,
                "html": html
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
        
        finally:
            browser.close()