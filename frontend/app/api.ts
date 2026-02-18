export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ReplyResponse {
    reply: string;
}

export async function fetchReply(messages: Message[]): Promise<ReplyResponse> {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/generate-reply`, {
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
