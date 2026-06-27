def generate_fixes(wcag_issues: list,
                   heuristic_issues: list = [],
                   dom_issues: list = []):
    fixes = []

    for issue in wcag_issues:
        fix = get_wcag_fix(issue)
        if fix:
            fixes.append(fix)

    for issue in heuristic_issues:
        fix = get_heuristic_fix(issue)
        if fix:
            fixes.append(fix)

    for issue in dom_issues:
        fix = get_dom_fix(issue)
        if fix:
            fixes.append(fix)

    return fixes


def get_wcag_fix(issue: dict):
    issue_type = issue["type"]
    element = issue.get("element", "")

    if issue_type == "missing_alt_text":
        return {
            "category": "WCAG",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "Image has no alt text — screen readers cannot describe it",
            "original": element,
            "fix_html": element.replace("<img ", '<img alt="Descriptive text here" '),
            "explanation": "Alt text helps blind users understand what the image shows. Also improves SEO."
        }

    elif issue_type == "missing_label":
        return {
            "category": "WCAG",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "Input field has no label — users don't know what to type",
            "original": element,
            "fix_html": f'<label for="field">Field Name</label>\n{element}',
            "explanation": "Labels help all users understand what each field is for."
        }

    elif issue_type == "empty_button":
        return {
            "category": "WCAG",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "Button has no text — users don't know what it does",
            "original": element,
            "fix_html": element.replace("<button ", '<button aria-label="Describe action here" '),
            "explanation": "Buttons need text or aria-label so screen readers can announce what they do."
        }

    elif issue_type == "missing_title":
        return {
            "category": "WCAG",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "Page has no title — bad for SEO and accessibility",
            "original": "<title></title>",
            "fix_html": "<title>Your Page Title Here</title>",
            "explanation": "Page title appears in browser tab and is announced by screen readers."
        }

    elif issue_type == "heading_skip":
        return {
            "category": "WCAG",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": issue["message"],
            "original": element,
            "fix_html": issue["fix"],
            "explanation": "Heading hierarchy helps screen reader users navigate page structure."
        }

    elif issue_type == "low_contrast":
        return {
            "category": "WCAG",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": issue["message"],
            "original": element,
            "fix_html": "/* Fix contrast */\n.element {\n  color: #1a1a1a;\n  background: #ffffff;\n}",
            "explanation": "Low contrast makes text hard to read for visually impaired users."
        }
    elif issue_type == "small_tap_target": 
        return {
            "category": "WCAG",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": issue["message"],
            "original": element,
            "fix_html": "/* Fix tap target size */\n.button, a {\n  min-width: 44px;\n  min-height: 44px;\n  padding: 12px 24px;\n  display: inline-flex;\n  align-items: center;\n}",
            "explanation": "Small tap targets cause misclicks on mobile. WCAG 2.5.5 requires minimum 44x44px touch targets."
        }
    return None


def get_heuristic_fix(issue: dict):
    issue_type = issue["type"]

    fixes_map = {
        "no_navigation": {
            "category": "Heuristic",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No navigation element found",
            "fix_html": "<nav>\n  <ul>\n    <li><a href='/'>Home</a></li>\n    <li><a href='/about'>About</a></li>\n  </ul>\n</nav>",
            "explanation": "Navigation helps users find their way around the site easily."
        },
        "no_search": {
            "category": "Heuristic",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No search functionality",
            "fix_html": '<input type="search" name="q" placeholder="Search..."\n  aria-label="Search" />',
            "explanation": "Search helps users find content quickly without browsing."
        },
        "icon_no_label": {
            "category": "Heuristic",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "Icon button has no label",
            "fix_html": '<button aria-label="Describe what this button does">\n  <!-- icon here -->\n</button>',
            "explanation": "Icon-only buttons confuse users who don't recognize the icon."
        },
        "no_footer": {
            "category": "Heuristic",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No footer found",
            "fix_html": "<footer>\n  <a href='/help'>Help</a>\n  <a href='/contact'>Contact</a>\n</footer>",
            "explanation": "Footer provides help links and builds user trust."
        },
        "no_skip_link": {
            "category": "Heuristic",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No skip to main content link",
            "fix_html": '<a href="#main" class="skip-link">Skip to main content</a>',
            "explanation": "Skip links help keyboard users bypass repetitive navigation."
        },
        "no_home_link": {
            "category": "Heuristic",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No home/logo link",
            "fix_html": '<a href="/" aria-label="Go to homepage">\n  <img src="logo.png" alt="Logo" />\n</a>',
            "explanation": "Clicking logo to go home is a universal UX convention."
        },
        "keyboard_nav_issue": { 
            "category": "Heuristic",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "Elements not reachable by keyboard",
            "fix_html": "<!-- Remove tabindex=-1 -->\n<button tabindex='0'>Click me</button>\n<a href='/' tabindex='0'>Link</a>",
            "explanation": "Keyboard users cannot interact with tabindex=-1 elements."
        },
        "no_main_landmark": {  
            "category": "Heuristic",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No main landmark found",
            "fix_html": "<main id='main'>\n  <!-- Main content here -->\n</main>",
            "explanation": "Main landmark helps screen readers jump to main content."
        }
    }
    

    return fixes_map.get(issue_type)


def get_dom_fix(issue: dict):
    issue_type = issue["type"]

    fixes_map = {
        "missing_meta_description": {
            "category": "DOM",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No meta description",
            "fix_html": '<meta name="description" content="Brief description (150-160 chars)">',
            "explanation": "Meta description appears in Google results. Improves SEO."
        },
        "missing_h1": {
            "category": "DOM",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No H1 tag found",
            "fix_html": "<h1>Your Main Page Heading</h1>",
            "explanation": "H1 tells search engines what the page is about."
        },
        "multiple_h1": {
            "category": "DOM",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "Multiple H1 tags found",
            "fix_html": "<!-- Keep only ONE h1 -->\n<h1>Main Heading</h1>\n<h2>Secondary Heading</h2>",
            "explanation": "Only one H1 per page — it's the main topic identifier."
        },
        "missing_lang": {
            "category": "DOM",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "Missing lang attribute",
            "fix_html": '<html lang="en">',
            "explanation": "Lang attribute helps screen readers use correct pronunciation."
        },
        "missing_viewport": {
            "category": "DOM",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No viewport meta tag",
            "fix_html": '<meta name="viewport" content="width=device-width, initial-scale=1">',
            "explanation": "Without viewport, mobile users see a desktop-sized page."
        },
        "missing_og_tags": {
            "category": "DOM",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No Open Graph tags",
            "fix_html": '<meta property="og:title" content="Your Title">\n<meta property="og:description" content="Description">',
            "explanation": "OG tags control how page looks when shared on social media."
        },
        "missing_favicon": {
            "category": "DOM",
            "issue_type": issue_type,
            "severity": issue["severity"],
            "problem": "No favicon found",
            "fix_html": '<link rel="icon" href="/favicon.ico">',
            "explanation": "Favicon appears in browser tab — improves brand recognition."
        }
    }

    return fixes_map.get(issue_type)