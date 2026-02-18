# Lead Response Assistant

A production-ready web application that generates safe, empathetic, and helpful customer support replies using the Cerebras API.

## 🎯 Goal

The app reads a customer enquiry and generates a response that:
*   Understands user intent
*   Acknowledges the issue empathetically
*   Asks 2–4 clarifying questions
*   Provides safe next steps
*   Avoids guarantees or fabricated claims

## 🧱 Tech Stack

*   **Backend**: Python, FastAPI, Cerebras LLM API
*   **Frontend**: Next.js (App Router), TypeScript, TailwindCSS
*   **Architecture**: Frontend → FastAPI → Cerebras API

## 📂 Architecture

```ascii
+------------+       +---------+       +--------------+
|  Frontend  | <---> | FastAPI | <---> | Cerebras API |
| (Next.js)  |       | Server  |       |   (LLM)      |
+------------+       +---------+       +--------------+
```

## 🚀 Setup Steps

### Prerequisites
*   Node.js & npm
*   Python 3.8+
*   Cerebras API Key

### Backend Setup

1.  Navigate to `backend/`:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Set up environment variables:
    *   Copy `.env.example` to `.env`
    *   Add your `CEREBRAS_API_KEY`
4.  Run server:
    ```bash
    uvicorn main:app --reload
    ```

### Frontend Setup

1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run development server:
    ```bash
    npm run dev
    ```

## 🧪 Example Usage

**Input:**
"Hi, I am getting damp patches on my bedroom wall after rains. What should I do?"

**Output:**
> "I'm so sorry to hear about the damp patches on your bedroom wall; that sounds really frustrating and concerning.
>
> To help you best, could you tell me:
> 1. How long have you noticed these patches appearing?
> 2. Are there any visible cracks on the exterior wall?
>
> Here are some general steps you might consider:
> *   Check for any blocked gutters or downpipes.
> *   Inspect the external brickwork for damage.
> *   Contact a professional surveyor if the issue persists."

## 🛡️ Safety Implementation

The system includes a safety layer (`safety.py`) that sanitizes responses to:
*   Remove absolute guarantees (e.g., "This will fix it" -> "This may help").
*   Avoid fabricated statistics.
*   Ensure a helpful but cautious tone.

## 🔮 Future Improvements

*   Add database persistence for chat history.
*   Implement user authentication.
*   Add more sophisticated prompt engineering for different query types.
*   Deploy to cloud (Vercel + Render/Railway).
