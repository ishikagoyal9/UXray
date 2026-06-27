def calculate_score(wcag_issues: list, 
                    heuristic_score: int = 100):

    if not wcag_issues:
        wcag_score = 100
    else:
        critical = len([i for i in wcag_issues 
                       if i["severity"] == "CRITICAL"])
        high = len([i for i in wcag_issues 
                   if i["severity"] == "HIGH"])
        medium = len([i for i in wcag_issues 
                     if i["severity"] == "MEDIUM"])
        low = len([i for i in wcag_issues 
                  if i["severity"] == "LOW"])

        wcag_score = 100
        if critical > 0:
            wcag_score -= min(30, critical * 3)
        if high > 0:
            wcag_score -= min(25, high * 2)
        if medium > 0:
            wcag_score -= min(15, medium * 1)
        if low > 0:
            wcag_score -= min(10, low * 0.5)

        wcag_score = max(0, wcag_score)

    final_score = round(
        (wcag_score * 0.40) +
        (heuristic_score * 0.35) +
        (100 * 0.25)  
    )

    if final_score >= 80:
        grade = "Good ✅"
    elif final_score >= 60:
        grade = "Needs Improvement ⚠️"
    elif final_score >= 40:
        grade = "Poor 🔴"
    else:
        grade = "Critical 🚨"

    return {
        "final_score": final_score,
        "wcag_score": wcag_score,
        "heuristic_score": heuristic_score,
        "grade": grade,
        "breakdown": {
            "critical": len([i for i in wcag_issues 
                           if i["severity"] == "CRITICAL"]),
            "high": len([i for i in wcag_issues 
                        if i["severity"] == "HIGH"]),
            "medium": len([i for i in wcag_issues 
                          if i["severity"] == "MEDIUM"]),
            "low": len([i for i in wcag_issues 
                       if i["severity"] == "LOW"])
        }
    }