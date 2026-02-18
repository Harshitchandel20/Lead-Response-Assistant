import os
import requests
import json
from dotenv import load_dotenv
from typing import List, Dict, Any

load_dotenv()

CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")
# Using a standard endpoint for Cerebras if available, otherwise typical OpenAI-compatible
# Based on public info, Cerebras inference API is often usage-compatible with OpenAI.
# However, user said "Sends request to Cerebras chat/completions endpoint".
# I'll use the official endpoint if I can guess it, usually `https://api.cerebras.ai/v1/chat/completions`
# If this is wrong, the user can correct it or I can debug.
CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions"

SYSTEM_PROMPT = """You are a helpful customer support assistant.

Rules:
1. Always acknowledge the customer’s issue with empathy.
2. Ask 2–4 clarifying questions.
3. Provide general safe next steps.
4. Do not make guarantees or promises.
5. Do not invent facts.
6. If information is missing, ask for it.
7. Use friendly and professional tone.
"""

def generate_response(messages: List[Dict[str, Any]]) -> str:
    """
    messages: list of dicts with keys 'role' and 'content'.
    """
    if not CEREBRAS_API_KEY:
        raise ValueError("CEREBRAS_API_KEY is not set")

    headers = {
        "Authorization": f"Bearer {CEREBRAS_API_KEY}",
        "Content-Type": "application/json"
    }

    # Keep recent history to avoid overly long context
    max_history = 12
    if isinstance(messages, list):
        convo = messages[-max_history:]
    else:
        # backward compatibility: single string message
        convo = [{"role": "user", "content": str(messages)}]

    payload_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in convo:
        # Support both dicts and Pydantic/model objects
        if isinstance(m, dict):
            role = m.get("role", "user")
            content = m.get("content", "")
        else:
            role = getattr(m, "role", "user")
            content = getattr(m, "content", "")
        # Ensure role mapping is valid for API
        if role not in ("user", "assistant", "system"):
            role = "user"
        payload_messages.append({"role": role, "content": content})

    payload = {
        "model": "llama3.1-8b",
        "messages": payload_messages,
        "temperature": 0.2,
        "max_tokens": 512
    }

    try:
        response = requests.post(CEREBRAS_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        print(f"Error calling Cerebras API: {e}")
        if response is not None:
            print(f"Response Content: {response.text}")
        raise e
