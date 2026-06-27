from bs4 import BeautifulSoup
import re


def hex_to_rgb(hex_color):
    hex_color = hex_color.strip('#')
    if len(hex_color) == 3:
        hex_color = ''.join([c*2 for c in hex_color])
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def get_relative_luminance(rgb):
    r, g, b = [x/255.0 for x in rgb]
    r = r/12.92 if r <= 0.03928 else ((r+0.055)/1.055)**2.4
    g = g/12.92 if g <= 0.03928 else ((g+0.055)/1.055)**2.4
    b = b/12.92 if b <= 0.03928 else ((b+0.055)/1.055)**2.4
    return 0.2126*r + 0.7152*g + 0.0722*b


def get_contrast_ratio(color1, color2):
    l1 = get_relative_luminance(color1)
    l2 = get_relative_luminance(color2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)


def parse_rgb(rgb_str):
    match = re.search(r'rgb\((\d+),\s*(\d+),\s*(\d+)\)', rgb_str)
    if match:
        return tuple(int(x) for x in match.groups())
    return None


def check_contrast_computed(css_colors: list):
    issues = []
    seen = set()
    count = 0

    for item in css_colors:
        if count >= 5:
            break

        color = item.get('color', '')
        bg = item.get('background', '')

        # Duplicate skip
        key = f"{color}_{bg}"
        if key in seen:
            continue
        seen.add(key)

        text_rgb = parse_rgb(color)
        bg_rgb = parse_rgb(bg)

        if not text_rgb or not bg_rgb:
            continue

    
        if text_rgb == bg_rgb:
            continue

        ratio = get_contrast_ratio(text_rgb, bg_rgb)

      
        if ratio <= 1.05:
            continue

        if ratio < 4.5:
            issues.append({
                "type": "low_contrast",
                "severity": "CRITICAL" if ratio < 3.0 else "HIGH",
                "element": item.get('tag', 'element'),
                "message": f"Contrast ratio {ratio:.1f}:1 — WCAG minimum is 4.5:1",
                "fix": "Change text color to darker shade"
            })
            count += 1

    return issues


def check_wcag(html: str, css_colors: list = []):
    soup = BeautifulSoup(html, 'html.parser')
    issues = []

    images = soup.find_all('img')
    for img in images:
        if not img.get('alt'):
            issues.append({
                "type": "missing_alt_text",
                "severity": "HIGH",
                "element": str(img),
                "message": "Image has no alt text",
                "fix": 'Add alt="description" to this image'
            })

    inputs = soup.find_all('input')
    for inp in inputs:
        if inp.get('type') != 'hidden':
            input_id = inp.get('id')
            if not input_id or not soup.find('label', {'for': input_id}):
                issues.append({
                    "type": "missing_label",
                    "severity": "HIGH",
                    "element": str(inp),
                    "message": "Input field has no label",
                    "fix": f'Add <label for="{input_id or "field"}">Field Name</label>'
                })

    headings = soup.find_all(['h1','h2','h3','h4','h5','h6'])
    heading_levels = [int(h.name[1]) for h in headings]
    for i in range(1, len(heading_levels)):
        if heading_levels[i] - heading_levels[i-1] > 1:
            issues.append({
                "type": "heading_skip",
                "severity": "MEDIUM",
                "element": str(headings[i]),
                "message": f"Heading jumps from H{heading_levels[i-1]} to H{heading_levels[i]}",
                "fix": f"Use H{heading_levels[i-1]+1} instead"
            })

    buttons = soup.find_all('button')
    for btn in buttons:
        if not btn.get_text(strip=True) and not btn.get('aria-label'):
            issues.append({
                "type": "empty_button",
                "severity": "CRITICAL",
                "element": str(btn),
                "message": "Button has no text or aria-label",
                "fix": 'Add text inside button or aria-label="action"'
            })

    title = soup.find('title')
    if not title or not title.get_text(strip=True):
        issues.append({
            "type": "missing_title",
            "severity": "HIGH",
            "element": "<title>",
            "message": "Page has no title",
            "fix": "<title>Your Page Title</title>"
        })

    contrast_issues = check_contrast_computed(css_colors)
    issues.extend(contrast_issues)

    return {
        "total_issues": len(issues),
        "issues": issues
    }