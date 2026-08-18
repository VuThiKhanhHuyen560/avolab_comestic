import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Send, X, Bot, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import { SkinType, SkinConcern } from '../../types';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export const AIChatbotModal: React.FC = () => {
  const { isAiBotOpen, setIsAiBotOpen, customer, products, addToCart, setSelectedProduct, updateCustomerSkinProfile } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello ${customer?.name || 'there'}! I'm AVOBOT, your AVOLAB AI Beauty Assistant. ✨\n\nI can analyze your skin type (${customer?.skinType || 'Sensitive'}) and concerns (${customer?.skinConcerns?.join(', ') || 'hydration'}) to curate custom vegan skincare routines. What skin goals are you focusing on today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const sendingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiBotOpen) {
      scrollToBottom();
    }
  }, [messages, isAiBotOpen]);

  if (!isAiBotOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsAiBotOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-7 sm:right-7 z-50 bg-[#4A5D4E] hover:bg-[#3A493D] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 border border-[#849673]/30 cursor-pointer active:scale-95 group"
        title="Open AVOLAB AI Beauty Assistant"
      >
        <Bot size={20} className="text-[#D9E3D0] group-hover:rotate-12 transition-transform" />
        <span className="font-bold text-xs tracking-wider uppercase whitespace-nowrap text-white">AI Beauty Advisor</span>
      </button>
    );
  }

  const handleSend = async (customPrompt?: string, explicitSkinType?: SkinType) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading || sendingRef.current) return;

    sendingRef.current = true;
    setIsLoading(true);
    if (!customPrompt) setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);

    try {
      const activeSkinType = explicitSkinType || customer?.skinType || 'Sensitive';
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          userProfile: {
            skinType: activeSkinType,
            skinConcerns: customer?.skinConcerns || [],
            name: customer?.name || 'Guest'
          }
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Here is your custom skincare guidance!' }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I couldn\'t process that request right now. Please try asking me again.'
      }]);
    } finally {
      setIsLoading(false);
      sendingRef.current = false;
    }
  };

  const handleQuickQuiz = (type: SkinType) => {
    updateCustomerSkinProfile(type, customer?.skinConcerns || []);
    handleSend(`I set my skin type to ${type}. Please recommend a 3-step routine!`, type);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[580px] bg-[#F9F7F2] rounded-3xl shadow-2xl border border-[#E6E1D6] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="bg-[#4A5D4E] text-white p-4 flex items-center justify-between border-b border-[#3A493D]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#849673] flex items-center justify-center text-white border border-[#D9E3D0]/30">
            <Bot size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs uppercase tracking-widest text-white">AVOBOT AI</h3>
              <span className="bg-[#D9E3D0] text-[#4A5D4E] text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">Gemini 3.6</span>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-[#D9E3D0]">AVOLAB Routine Advisor</p>
          </div>
        </div>
        <button
          onClick={() => setIsAiBotOpen(false)}
          className="text-[#D9E3D0] hover:text-white p-1.5 rounded-full hover:bg-[#3A493D] transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Notice Banner */}
      <div className="bg-[#F0EBE1] text-[#4A5D4E] text-[10px] px-3 py-1.5 border-b border-[#E6E1D6] text-center font-medium uppercase tracking-wider">
        ℹ️ General skincare guidance only. Not medical diagnostic advice.
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9F7F2]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-[#4A5D4E] text-white rounded-br-none shadow-sm font-medium'
                  : 'bg-white text-[#2D2D2D] border border-[#E6E1D6] rounded-bl-none shadow-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#E6E1D6] rounded-2xl rounded-bl-none p-3 text-xs text-[#707070] flex items-center gap-2">
              <Sparkles size={14} className="animate-spin text-[#849673]" />
              <span>Analyzing clean formulations...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Quick Chips */}
      <div className="p-2.5 bg-[#F0EBE1] border-t border-[#E6E1D6] flex items-center gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
        <span className="text-[#5A5A5A] font-bold uppercase tracking-wider flex-shrink-0">Skin Type:</span>
        {(['Sensitive', 'Dry', 'Oily', 'Combination'] as SkinType[]).map(st => (
          <button
            key={st}
            onClick={() => handleQuickQuiz(st)}
            className="px-2.5 py-0.5 rounded-full bg-white hover:bg-[#D9E3D0] text-[#4A5D4E] font-bold border border-[#E6E1D6] flex-shrink-0 transition-colors uppercase tracking-wider"
          >
            {st}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-[#E6E1D6] flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask AVOBOT about clean skincare routines..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[#F9F7F2] border border-[#E6E1D6] rounded-full px-3.5 py-2 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] placeholder-[#888]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-[#4A5D4E] text-white p-2 rounded-full hover:bg-[#3A493D] disabled:opacity-50 transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
