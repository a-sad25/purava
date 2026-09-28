import os
import json
import google.generativeai as genai

# Setup API Key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-pro')
else:
    model = None

def structure_challenge(raw_text: str):
    if not model:
        # Fallback
        return {
            "problem_statement": "Structured: " + raw_text,
            "desired_outcome": "Reduce overhead by 30%.",
            "kpi": "Average process time",
            "baseline": 100,
            "target": 70,
            "pilot_duration": 90,
            "risks": ["Adoption risk", "Integration risk"],
            "evaluation_criteria": ["Technical feasibility", "Innovation"]
        }
    
    prompt = f"""
    You are an expert government procurement structurer. 
    Transform this raw challenge input into a structured pilot challenge:
    RAW INPUT: "{raw_text}"
    
    Return a JSON object with:
    - problem_statement (str)
    - desired_outcome (str)
    - kpi (str)
    - baseline (float)
    - target (float)
    - pilot_duration (int in days)
    - risks (list of strings)
    - evaluation_criteria (list of strings)
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        # Strip markdown if present
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        return json.loads(text)
    except Exception as e:
        print("AI generation failed:", e)
        # Fallback
        return {
            "problem_statement": "Structured: " + raw_text,
            "desired_outcome": "Reduce overhead by 30%.",
            "kpi": "Average process time",
            "baseline": 100,
            "target": 70,
            "pilot_duration": 90,
            "risks": ["Adoption risk", "Integration risk"],
            "evaluation_criteria": ["Technical feasibility", "Innovation"]
        }

def get_assistant_response(context: str, question: str):
    if not model:
        return "The AI assistant is running in offline mode. Please refer to the pilot dashboard for exact details."
    
    prompt = f"""
    You are the PURAVA AI Assistant. Answer the question based on the provided context.
    CONTEXT:
    {context}
    
    QUESTION: {question}
    """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "I'm sorry, I couldn't process that request at the moment."
