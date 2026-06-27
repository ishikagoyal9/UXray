from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def get_chat_response(question: str, audit_context: dict):

    context = f"""
    You are UXray — a UX audit assistant.
    You help developers understand UX issues.
    
    Website: {audit_context.get('url', '')}
    Final Score: {audit_context.get('final_score', '')}/100
    Grade: {audit_context.get('grade', '')}
    
    Issues found:
    - Critical: {audit_context.get('critical', 0)}
    - High: {audit_context.get('high', 0)}
    - Medium: {audit_context.get('medium', 0)}
    - Low: {audit_context.get('low', 0)}
    
    WCAG Issues: {audit_context.get('wcag_total', 0)}
    Heuristic Issues: {audit_context.get('heuristic_total', 0)}
    DOM Issues: {audit_context.get('dom_total', 0)}
    
    Rules:
    - Always respond in English only
      Casual and friendly tone
      Not too formal
    - Be specific and helpful
    - Always suggest actionable fixes
    - Keep answers concise
    """

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=f"{context}\n\nUser question: {question}"
    )

    return {
        "answer": response.text
    }