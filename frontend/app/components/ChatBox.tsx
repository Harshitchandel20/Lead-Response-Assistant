"use client";

import { useState, useRef, useEffect } from 'react';
import { fetchReply } from '../api';
import { Send, User as UserIcon, Bot, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewConversation = () => {
    setMessages([]);
    setInput('');
    setError(null);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history from existing messages + latest user message
      const history = messages.map(m => ({ role: m.role as any, content: m.content }));
      history.push({ role: 'user', content: userMessage.content });
      const data = await fetchReply(history);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
               <Bot className="w-8 h-8" /> 
             </div>
             Lead Response Assistant
          </h2>
          <div className="absolute top-4 right-4">
            <button
              onClick={handleNewConversation}
              className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              New Conversation
            </button>
          </div>
          <p className="text-violet-100 text-sm mt-1 ml-14 opacity-90 font-medium tracking-wide">
            Intelligent Customer Support Agent
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 scroll-smooth">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-32 animate-fade-in">
            <div className="bg-white p-6 rounded-full inline-block shadow-sm mb-4">
              <Bot className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">How can I help you today?</h3>
            <p className="text-sm max-w-sm mx-auto">
              I can draft empathetic, safe, and professional responses to customer enquiries.
            </p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full group ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div
              className={`flex max-w-[85%] md:max-w-[75%] rounded-3xl p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
              }`}
            >
              <div className="mr-4 mt-1 flex-shrink-0">
                {msg.role === 'user' ? (
                  <div className="bg-white/20 p-1.5 rounded-full">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="bg-indigo-50 p-1.5 rounded-full">
                    <Bot className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
              </div>
              <div className="whitespace-pre-wrap text-[15px] leading-relaxed font-normal tracking-wide">
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
           <div className="flex justify-start w-full animate-pulse">
            <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-bl-none shadow-sm flex items-center gap-3">
               <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
               <span className="text-slate-400 text-sm font-medium">Drafting response...</span>
            </div>
           </div>
        )}

        {error && (
            <div className="w-full bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex items-center gap-2 animate-fade-in shadow-sm">
                <AlertCircle className="w-5 h-5" />
                {error}
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-5 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex gap-3 items-center relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a customer enquiry..."
            className="flex-1 p-4 pl-6 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white text-slate-700 placeholder:text-slate-400 shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shadow-lg shadow-indigo-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
         <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
               Safety Guardrails Active
            </p>
         </div>
      </div>
    </div>
  );
}
