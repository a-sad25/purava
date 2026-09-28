import React, { useState } from 'react';
import { getAiAssistantResponse } from '../api';
import { Bot, X, Send, Sparkles } from 'lucide-react';

const AIAssistant = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) => {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{role: string, text: string}[]>([
    {role: 'ai', text: 'Hello! I am the PURAVA Assistant. You can ask me about pilot statuses, why a startup was matched, or what evidence is required.'}
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userQ = query;
    setChat(prev => [...prev, {role: 'user', text: userQ}]);
    setQuery('');
    setLoading(true);

    try {
      const context = "Current active pilot: QueueAI. Status: ON TRACK. KPIs: 37.8% reduction in waiting time (Target exceeded). Risks: Patient Data Exposure (Mitigated).";
      const response = await getAiAssistantResponse(context, userQ);
      setChat(prev => [...prev, {role: 'ai', text: response}]);
    } catch (err) {
      setChat(prev => [...prev, {role: 'ai', text: "Sorry, I couldn't reach the AI service right now."}]);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col z-50 overflow-hidden">
      <div className="bg-[#1F3A5F] text-white p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 font-bold text-sm">
          <Bot size={18} className="text-slate-300"/> AI Assistance
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white"><X size={18}/></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 min-h-0">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-[#1F3A5F] text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="max-w-[80%] p-3 rounded-lg text-sm bg-white border border-slate-200 text-slate-500 rounded-bl-none flex gap-2 items-center shadow-sm">
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
             </div>
           </div>
        )}
      </div>
      
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={query} 
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#1F3A5F]"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="bg-[#1F3A5F] text-white p-2 rounded-md hover:bg-slate-800 disabled:opacity-50"
          >
            <Send size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
