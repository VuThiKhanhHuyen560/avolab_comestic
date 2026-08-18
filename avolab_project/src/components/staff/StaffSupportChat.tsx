import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Headphones, Send, UserRound, Clock, MessageSquare } from 'lucide-react';

export const StaffSupportChat: React.FC = () => {
  const { supportTickets, addSupportReply, showToast } = useApp();
  const [activeId, setActiveId] = useState<string | null>(supportTickets[0]?.id || null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const active = supportTickets.find(t => t.id === activeId) || supportTickets[0];
  const openTickets = useMemo(() => [...supportTickets].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()), [supportTickets]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault(); if (!active || !reply.trim() || sending) return;
    setSending(true); const updated = await addSupportReply(active.id, reply.trim()); setSending(false);
    if (updated) { setReply(''); showToast('Reply sent to customer.'); }
  };

  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-5">
    <div className="border-b border-stone-200 pb-4 flex items-center justify-between"><div><h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Customer Support Chat</h1><p className="text-xs text-stone-500 mt-1">Respond to customer conversations in real time.</p></div><div className="flex items-center gap-2 text-[10px] font-bold text-[#2E4A32] bg-[#D9E3D0] px-3 py-2 rounded-full"><Headphones size={14}/> STAFF LIVE DESK</div></div>
    <div className="grid lg:grid-cols-[340px_1fr] gap-5 min-h-[600px]">
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm"><div className="px-5 py-4 border-b border-stone-100 flex justify-between"><h3 className="font-bold text-xs uppercase tracking-wider">Conversations</h3><span className="text-[10px] text-stone-400">{openTickets.length}</span></div>{openTickets.map(t => <button key={t.id} onClick={()=>setActiveId(t.id)} className={`w-full text-left p-4 border-b border-stone-100 ${active?.id===t.id?'bg-[#F3F7EF]':'hover:bg-[#FAF8F5]'}`}><div className="flex justify-between gap-2"><span className="font-mono font-bold text-xs">{t.ticketNumber}</span><span className="text-[9px] uppercase font-bold text-[#2E4A32]">{t.status.replace(/_/g,' ')}</span></div><p className="font-semibold text-xs mt-1 text-stone-800 truncate">{t.customerName}</p><p className="text-[10px] text-stone-400 mt-1">{t.subject}</p><p className="text-[9px] text-stone-400 mt-1 flex items-center gap-1"><Clock size={9}/>{new Date(t.updatedAt).toLocaleString()}</p></button>)}</div>
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">{active ? <><div className="px-5 py-4 border-b border-stone-100 bg-[#FAF8F5]"><p className="font-mono text-xs font-bold text-[#1C2E20]">{active.ticketNumber}</p><h2 className="font-serif font-bold text-lg text-stone-900">{active.customerName}</h2><p className="text-[10px] text-stone-500">{active.customerEmail} · {active.subject}</p></div><div className="flex-1 p-5 space-y-4 bg-[#FCFBF8] overflow-y-auto max-h-[480px]">{active.messages.map(m=>{const staff=m.senderRole!=='CUSTOMER';return <div key={m.id} className={`flex ${staff?'justify-end':'justify-start'}`}><div className={`max-w-[78%] rounded-2xl px-4 py-3 ${staff?'bg-[#4A5D4E] text-white rounded-br-md':'bg-white border border-stone-200 text-stone-800 rounded-bl-md'}`}><div className="flex items-center gap-2 mb-1"><UserRound size={11}/><span className="text-[10px] font-bold">{m.senderName}</span></div><p className="text-xs leading-relaxed">{m.message}</p><p className={`text-[9px] mt-2 ${staff?'text-white/70':'text-stone-400'}`}>{new Date(m.timestamp).toLocaleString()}</p></div></div>})}</div><form onSubmit={send} className="p-4 border-t border-stone-100 flex gap-2"><input value={reply} onChange={e=>setReply(e.target.value)} placeholder="Reply to customer…" className="flex-1 bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-[#2E4A32]"/><button disabled={sending||!reply.trim()} className="bg-[#4A5D4E] text-white px-4 rounded-xl disabled:opacity-50"><Send size={15}/></button></form></> : <div className="flex-1 flex items-center justify-center text-center"><div><MessageSquare size={38} className="mx-auto text-[#849673] mb-3"/><p className="font-bold text-sm">No customer chats yet.</p></div></div>}</div>
    </div>
  </div>;
};
