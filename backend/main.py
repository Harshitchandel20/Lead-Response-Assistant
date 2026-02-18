from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import GenerateReplyRequest, GenerateReplyResponse
from ai_service import generate_response
from safety import sanitize_response
import os

app = FastAPI(title="Lead Response Assistant API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-reply", response_model=GenerateReplyResponse)
async def generate_reply(request: GenerateReplyRequest):
    try:
        # 1. Generate response via Cerebras
        # pass the conversation history (list of messages)
        raw_reply = generate_response(request.messages)
        
        # 2. Apply safety layer
        safe_reply = sanitize_response(raw_reply)
        
        return GenerateReplyResponse(reply=safe_reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
