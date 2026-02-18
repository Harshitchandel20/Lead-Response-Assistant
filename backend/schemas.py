from pydantic import BaseModel
from typing import List


class Message(BaseModel):
    role: str
    content: str


class GenerateReplyRequest(BaseModel):
    messages: List[Message]


class GenerateReplyResponse(BaseModel):
    reply: str
