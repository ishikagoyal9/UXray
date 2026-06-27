from bs4 import BeautifulSoup


def check_dom(html: str):
    soup = BeautifulSoup(html, 'html.parser')
    issues = []
    score = 100

    meta_desc = soup.find('meta', {'name': 'description'})
    if not meta_desc or not meta_desc.get('content'):
        issues.append({
            "type": "missing_meta_description",
            "severity": "MEDIUM",
            "message": "No meta description found",
            "fix": '<meta name="description" content="Your page description here">'
        })
        score -= 10

    h1_tags = soup.find_all('h1')
    if len(h1_tags) == 0:
        issues.append({
            "type": "missing_h1",
            "severity": "HIGH",
            "message": "No H1 tag found on page",
            "fix": "Add one <h1> tag as main page heading"
        })
        score -= 15
    elif len(h1_tags) > 1:
        issues.append({
            "type": "multiple_h1",
            "severity": "MEDIUM",
            "message": f"{len(h1_tags)} H1 tags found — should be only 1",
            "fix": "Keep only one <h1> tag per page"
        })
        score -= 8

    html_tag = soup.find('html')
    if html_tag and not html_tag.get('lang'):
        issues.append({
            "type": "missing_lang",
            "severity": "HIGH",
            "message": "HTML tag missing lang attribute",
            "fix": '<html lang="en">'
        })
        score -= 12

    viewport = soup.find('meta', {'name': 'viewport'})
    if not viewport:
        issues.append({
            "type": "missing_viewport",
            "severity": "HIGH",
            "message": "No viewport meta tag — mobile users affected",
            "fix": '<meta name="viewport" content="width=device-width, initial-scale=1">'
        })
        score -= 12

    favicon = soup.find('link', {'rel': lambda x: x and 'icon' in str(x).lower()})
    if not favicon:
        issues.append({
            "type": "missing_favicon",
            "severity": "LOW",
            "message": "No favicon found",
            "fix": '<link rel="icon" href="/favicon.ico">'
        })
        score -= 3

    headings = soup.find_all(['h1','h2','h3','h4','h5','h6'])
    heading_levels = [int(h.name[1]) for h in headings]
    for i in range(1, len(heading_levels)):
        if heading_levels[i] - heading_levels[i-1] > 1:
            issues.append({
                "type": "heading_skip",
                "severity": "MEDIUM",
                "message": f"Heading jumps H{heading_levels[i-1]} to H{heading_levels[i]}",
                "fix": f"Use H{heading_levels[i-1]+1} instead of H{heading_levels[i]}"
            })
            score -= 5

    og_title = soup.find('meta', {'property': 'og:title'})
    if not og_title:
        issues.append({
            "type": "missing_og_tags",
            "severity": "LOW",
            "message": "No Open Graph tags — social sharing affected",
            "fix": '<meta property="og:title" content="Your Title">'
        })
        score -= 3

    return {
        "dom_score": max(0, score),
        "total_issues": len(issues),
        "issues": issues
    }