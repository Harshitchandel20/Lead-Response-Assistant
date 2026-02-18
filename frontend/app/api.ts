export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ReplyResponse {
    reply: string;
}

export async function fetchReply(messages: Message[]): Promise<ReplyResponse> {
    const response = await fetch('http://localhost:8000/generate-reply', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to fetch reply');
    }

    return response.json();
}
