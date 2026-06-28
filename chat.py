from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

_client = None


def _get_client():
    global _client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    if _client is None:
        _client = genai.Client(api_key=api_key)
    return _client


def get_chat_response(question: str, audit_context: dict):
    """Use Gemini only as a conversational explanation layer for our own audit results."""
    client = _get_client()
    if client is None:
        return {
            "answer": "Gemini API key is missing. Add GEMINI_API_KEY in your .env file, restart the backend, and try again."
        }

    context = f"""
You are UXray's conversational UX assistant.
Important: The audit engine has already generated the scores and issues. Do not pretend you scanned the site yourself.
Your role is only to explain the audit, prioritize fixes, and make suggestions in simple language.

Website: {audit_context.get('url', '')}
Final Score: {audit_context.get('final_score', '')}/100
Grade: {audit_context.get('grade', '')}
WCAG Score: {audit_context.get('wcag_score', '')}/100
Heuristic Score: {audit_context.get('heuristic_score', '')}/100
DOM Score: {audit_context.get('dom_score', '')}/100

Issues found:
- Critical: {audit_context.get('critical', 0)}
- High: {audit_context.get('high', 0)}
- Medium: {audit_context.get('medium', 0)}
- Low: {audit_context.get('low', 0)}

Issue totals:
- WCAG Issues: {audit_context.get('wcag_total', 0)}
- Heuristic Issues: {audit_context.get('heuristic_total', 0)}
- DOM Issues: {audit_context.get('dom_total', 0)}

Sample detected issues:
{audit_context.get('issues_summary', 'No detailed issue list was provided.')}

Rules:
- Answer in English.
- Keep it short, clear, and demo-friendly.
- Give practical fixes.
- Mention WCAG/Nielsen only when relevant.
- Never say you are the core audit engine. You are the explanation layer.
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=f"{context}\n\nUser question: {question}"
    )

    return {"answer": response.text or "I could not generate an answer right now."}