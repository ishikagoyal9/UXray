from bs4 import BeautifulSoup


def check_heuristics(html: str):
    soup = BeautifulSoup(html, 'html.parser')
    issues = []
    score = 100

    nav = soup.find_all('nav')
    if not nav:
        issues.append({
            "type": "no_navigation",
            "severity": "HIGH",
            "message": "No navigation element found",
            "fix": "Add <nav> element for main navigation"
        })
        score -= 10

    search = soup.find('input', {'type': 'search'}) or \
             soup.find('input', {'name': 'q'}) or \
             soup.find('input', {'placeholder': lambda x: x and 'search' in x.lower()})
    if not search:
        issues.append({
            "type": "no_search",
            "severity": "MEDIUM",
            "message": "No search functionality found",
            "fix": "Add search bar for better user navigation"
        })
        score -= 5

    forms = soup.find_all('form')
    for form in forms:
        inputs = form.find_all('input', {'required': True})
        for inp in inputs:
            if not inp.get('aria-describedby') and \
               not form.find('span', {'class': lambda x: x and 'error' in str(x).lower()}):
                issues.append({
                    "type": "no_error_message",
                    "severity": "MEDIUM",
                    "message": "Required field has no error message guidance",
                    "fix": "Add error message for required fields"
                })
                score -= 5
                break

    icon_buttons = soup.find_all('button')
    for btn in icon_buttons:
        has_svg = btn.find('svg')
        has_img = btn.find('img')
        has_text = btn.get_text(strip=True)
        has_aria = btn.get('aria-label')

        if (has_svg or has_img) and not has_text and not has_aria:
            issues.append({
                "type": "icon_no_label",
                "severity": "HIGH",
                "message": "Icon button has no label — users don't know what it does",
                "fix": 'Add aria-label="action description" to button'
            })
            score -= 8

    footer = soup.find('footer')
    if not footer:
        issues.append({
            "type": "no_footer",
            "severity": "LOW",
            "message": "No footer found",
            "fix": "Add footer with help links and contact info"
        })
        score -= 3

    skip_link = soup.find('a', string=lambda x: x and 'skip' in x.lower())
    if not skip_link:
        issues.append({
            "type": "no_skip_link",
            "severity": "MEDIUM",
            "message": "No skip to main content link",
            "fix": '<a href="#main">Skip to main content</a>'
        })
        score -= 5
    logo_link = soup.find('a', {'href': '/'}) or \
                soup.find('a', {'href': '#'})
    if not logo_link:
        issues.append({
            "type": "no_home_link",
            "severity": "LOW",
            "message": "No home/logo link found",
            "fix": "Wrap logo in <a href='/'>link</a>"
        })
        score -= 3

    focusable = soup.find_all(['a', 'button', 'input', 'select', 'textarea'])
    non_focusable = []
    for el in focusable:
        tabindex = el.get('tabindex')
        if tabindex:
            try:
                if int(tabindex) < 0:
                    non_focusable.append(el)
            except:
                pass

    if non_focusable:
        issues.append({
            "type": "keyboard_nav_issue",
            "severity": "HIGH",
            "message": f"{len(non_focusable)} elements have tabindex=-1 — keyboard users cannot reach them",
            "fix": "Remove tabindex=-1 or change to tabindex=0"
        })
        score -= 10
    main = soup.find('main') or soup.find(attrs={"role": "main"})
    if not main:
        issues.append({
            "type": "no_main_landmark",
            "severity": "MEDIUM",
            "message": "No main landmark — screen readers cannot identify main content",
            "fix": "Add <main> tag or role='main' to main content"
        })
        score -= 5

    return {
        "heuristic_score": max(0, score),
        "total_issues": len(issues),
        "issues": issues
    }