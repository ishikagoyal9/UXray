# from playwright.sync_api import sync_playwright
# import base64
# def scan_website(url: str):
#     with sync_playwright() as p:
#         browser = p.chromium.launch(headless=True)

#         context = browser.new_context(
#             user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
#             viewport={"width": 1280, "height": 720}
#         )

#         page = context.new_page()

#         try:
#             page.goto(
#                 url,
#                 wait_until="domcontentloaded",
#                 timeout=30000
#             )

#             screenshot_bytes = page.screenshot(full_page=False)
#             screenshot_base64 = base64.b64encode(
#                 screenshot_bytes
#             ).decode('utf-8')

#             html = page.content()
#             title = page.title()
        
#             css_colors = page.evaluate("""
#                 () => {
#                     const elements = document.querySelectorAll('*');
#                     const results = [];
                    
#                     for (let el of elements) {
#                         const style = window.getComputedStyle(el);
#                         const color = style.color;
#                         const bg = style.backgroundColor;
                        
#                         if (bg === 'rgba(0, 0, 0, 0)') continue;
#                         if (!color || !bg) continue;
                        
#                         results.push({
#                             tag: el.tagName,
#                             color: color,
#                             background: bg
#                         });
                        
#                         if (results.length >= 50) break;
#                     }
#                     return results;
#                 }
#             """)

#             return {
#                 "success": True,
#                 "url": url,
#                 "title": title,
#                 "html": html,
#                 "screenshot": screenshot_base64
#             }

#         except Exception as e:
#             return {
#                 "success": False,
#                 "error": str(e)
#             }

#         finally:
#             browser.close()

import base64
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright


def _same_domain(base_url: str, href: str) -> bool:
    try:
        base = urlparse(base_url)
        target = urlparse(urljoin(base_url, href))
        return target.scheme in ("http", "https") and target.netloc == base.netloc
    except Exception:
        return False


def _normalize_url(base_url: str, href: str) -> str:
    return urljoin(base_url, href).split("#")[0].rstrip("/")


def _page_type_from_url(url: str, title: str = "") -> str:
    text = f"{url} {title}".lower()

    if any(word in text for word in ["login", "signin", "sign-in", "account"]):
        return "Login"
    if any(word in text for word in ["signup", "register", "create-account"]):
        return "Signup"
    if any(word in text for word in ["product", "item", "p/"]):
        return "Product"
    if any(word in text for word in ["cart", "basket"]):
        return "Cart"
    if any(word in text for word in ["checkout", "payment"]):
        return "Checkout"
    if any(word in text for word in ["contact", "support", "help"]):
        return "Contact"
    if any(word in text for word in ["about", "company"]):
        return "About"
    if any(word in text for word in ["faq", "questions"]):
        return "FAQ"

    return "Home"


async def _capture_page(context, url: str, page_index: int = 0):
    page = await context.new_page()

    await page.goto(url, wait_until="domcontentloaded", timeout=30000)

    try:
        await page.wait_for_load_state("networkidle", timeout=8000)
    except Exception:
        pass

    # Wait a little for lazy-loaded images/cards to appear.
    try:
        await page.wait_for_timeout(1200)
    except Exception:
        pass

    # Full-page screenshot so issue preview is more useful.
    screenshot_bytes = await page.screenshot(
        full_page=True,
        animations="disabled"
    )
    screenshot_base64 = base64.b64encode(screenshot_bytes).decode("utf-8")

    html = await page.content()
    title = await page.title()
    page_type = _page_type_from_url(url, title)

    css_colors = await page.evaluate(
        """
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
                    color,
                    background: bg
                });

                if (results.length >= 80) break;
            }

            return results;
        }
        """
    )

    links = await page.evaluate(
        """
        () => Array.from(document.querySelectorAll('a[href]'))
          .map(a => ({
            href: a.getAttribute('href'),
            text: (a.innerText || a.getAttribute('aria-label') || a.title || '').trim()
          }))
          .filter(item => item.href)
          .slice(0, 200)
        """
    )

    await page.close()

    return {
        "url": url,
        "title": title,
        "page_type": page_type,
        "page_index": page_index,
        "html": html,
        "screenshot": screenshot_base64,
        "css_colors": css_colors,
        "links": links,
    }


async def scan_website(url: str, max_pages: int = 8):
    """
    Scan a live website with Playwright and capture multiple same-domain pages.

    Output:
    - pages[] contains separate screenshots for each page
    - each page has page_type: Home/Login/Product/Cart/Checkout/Contact/etc.
    - backend will later attach each issue to its page screenshot
    """

    browser = None

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)

            context = await browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
                viewport={"width": 1280, "height": 720},
            )

            first = await _capture_page(context, url, 0)

            priority_words = (
                "home",
                "login",
                "signin",
                "sign in",
                "sign-in",
                "register",
                "signup",
                "sign up",
                "products",
                "product",
                "category",
                "shop",
                "cart",
                "bag",
                "checkout",
                "payment",
                "wishlist",
                "orders",
                "profile",
                "account",
                "contact",
                "support",
                "help",
                "about",
                "faq",
            )

            seen = {url.rstrip("/")}
            candidates = []

            def link_score(item):
                text = f"{item.get('text', '')} {item.get('href', '')}".lower()

                for idx, word in enumerate(priority_words):
                    if word in text:
                        return idx

                return 999

            raw_links = first.get("links", [])

            for item in sorted(raw_links, key=link_score):
                href = item.get("href") if isinstance(item, dict) else item
                absolute = _normalize_url(url, href)

                if not absolute:
                    continue

                if absolute in seen:
                    continue

                if not _same_domain(url, absolute):
                    continue

                seen.add(absolute)
                candidates.append(absolute)

                if len(candidates) >= max_pages - 1:
                    break

            pages = [first]

            for index, next_url in enumerate(candidates[: max_pages - 1], start=1):
                try:
                    captured = await _capture_page(context, next_url, index)
                    pages.append(captured)
                except Exception:
                    continue

            await browser.close()

            return {
                "success": True,
                "url": url,
                "title": first.get("title", ""),
                "html": first.get("html", ""),
                "screenshot": first.get("screenshot", ""),
                "css_colors": first.get("css_colors", []),
                "pages": [
                    {k: v for k, v in page.items() if k != "links"}
                    for page in pages
                ],
                "pages_crawled": len(pages),
            }

    except Exception as e:
        try:
            if browser:
                await browser.close()
        except Exception:
            pass

        return {
            "success": False,
            "error": str(e),
        }