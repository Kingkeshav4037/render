import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, AlertTriangle, ArrowRight } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from 'sonner';

export const Assistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hei! I am your personal Norway assistant. How can I help you plan your trip today?', isTransaction: false }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, isTransaction: false }]);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      // Intent parsing (Rule 26)
      const isTransactionalIntent = userMsg.toLowerCase().includes('book') || userMsg.toLowerCase().includes('buy') || userMsg.toLowerCase().includes('reserve');

      if (!apiKey) {
        // Fallback Mock Response if no API key is present
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: isTransactionalIntent 
              ? "I can help you with that booking. Please review the details below before we proceed with the transaction."
              : "I see you're asking about that! (Note: Gemini API key missing in .env.local, this is a mock response).",
            isTransaction: isTransactionalIntent
          }]);
          setLoading(false);
        }, 1500);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are a premium, helpful travel assistant for "Norway SmartLife". Keep answers concise and related to travel in Norway. User says: ${userMsg}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: text,
        isTransaction: isTransactionalIntent
      }]);
    } catch (error) {
      toast.error('Failed to communicate with AI');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FDFDFD] font-sans pb-32 flex flex-col pt-24">
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles size={24} className="text-aurora-green" />
          </div>
          <h1 className="text-3xl font-display font-light text-navy-900">
            Personal <span className="font-bold">Assistant</span>
          </h1>
          {!import.meta.env.VITE_GEMINI_API_KEY && (
            <p className="text-xs text-amber-500 font-bold mt-2 uppercase tracking-widest">Running in Mock Mode (API Key Missing)</p>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-6 mb-8 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-gray-100 text-gray-500' : 'bg-aurora-green/20 text-aurora-green'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col gap-2">
                  <div className={`p-5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-navy-900 text-white rounded-tr-sm shadow-md' 
                      : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Transaction UI Rule 26 */}
                  {msg.isTransaction && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mt-2 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-amber-900 mb-1">Transaction Confirmation</p>
                          <p className="text-xs text-amber-700 mb-3">This action will charge your default payment method and finalize a booking.</p>
                          <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors flex items-center gap-2">
                            Confirm Booking <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] flex gap-4 flex-row">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-aurora-green/20 text-aurora-green">
                  <Sparkles size={18} className="animate-pulse" />
                </div>
                <div className="p-5 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border border-gray-200 p-2 rounded-2xl shadow-lg flex items-center gap-2 sticky bottom-6">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your trip, weather, or recommendations..."
            className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm text-navy-900 placeholder:text-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center hover:bg-aurora-green hover:text-navy-900 transition-colors disabled:opacity-50"
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>

      </div>
    </div>
  );
};
