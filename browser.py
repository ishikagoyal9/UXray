from playwright.sync_api import sync_playwright
import base64
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
                wait_until="domcontentloaded",
                timeout=30000
            )

            screenshot_bytes = page.screenshot(full_page=False)
            screenshot_base64 = base64.b64encode(
                screenshot_bytes
            ).decode('utf-8')

            html = page.content()
            title = page.title()
        
            css_colors = page.evaluate("""
                () => {
                    const elements = document.querySelectorAll('*');
                    const results = [];
                    
                    for (let el of elements) {
                        const style = window.getComputedStyle(el);
                        const color = style.color;
                        const bg = style.backgroundColor;
                        
                        if (bg === 'rgba(0, 0, 0, 0)') continue;
                        if (!color || !bg) continue;
                        
                        results.push({
                            tag: el.tagName,
                            color: color,
                            background: bg
                        });
                        
                        if (results.length >= 50) break;
                    }
                    return results;
                }
            """)

            return {
                "success": True,
                "url": url,
                "title": title,
                "html": html,
                "screenshot": screenshot_base64
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

        finally:
            browser.close()