import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HelpCircle, MessageSquare, Search, Send, CheckCircle2, UserRound, Clock, Headphones } from 'lucide-react';

export const CustomerSupport: React.FC = () => {
  const { customer, setIsAiBotOpen, showToast, supportTickets, createSupportTicket, addSupportReply } = useApp();
  const [searchFaq, setSearchFaq] = useState('');
  const [subject, setSubject] = useState('Order / Product Support');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(supportTickets[0]?.id || null);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);

  const faqs = [
    { q: 'What is BOPIS store pickup?', a: 'BOPIS stands for Buy Online, Pick Up In Store. Order online, receive a digital QR pass, and pick up your items at your selected AVOLAB store counter in under 2 hours.' },
    { q: 'Are AVOLAB products 100% vegan & cruelty-free?', a: 'Yes! All AVOLAB formulas are certified 100% vegan, cruelty-free, paraben-free, and dermatologically tested.' },
    { q: 'How does the AI Beauty Assistant work?', a: 'AVOBOT analyzes your skin type, moisture barriers, and active concerns to formulate custom routines matched precisely to your needs.' },
    { q: 'What is the return policy?', a: 'We offer a 30-day gentle skin guarantee. If a formulation does not agree with your skin, return it at any store counter or via mail.' }
  ];
  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchFaq.toLowerCase()) || f.a.toLowerCase().includes(searchFaq.toLowerCase()));
  const myTickets = useMemo(() => supportTickets.filter(t => t.customerId === customer.id), [supportTickets, customer.id]);
  const activeTicket = myTickets.find(t => t.id === activeTicketId) || myTickets[0];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || creating) return;
    setCreating(true);
    const ticket = await createSupportTicket(subject.trim(), message.trim());
    setCreating(false);
    if (ticket) {
      setActiveTicketId(ticket.id);
      setMessage('');
      showToast('Your message has been sent to the AVOLAB staff team.');
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !reply.trim() || sending) return;
    setSending(true);
    const updated = await addSupportReply(activeTicket.id, reply.trim());
    setSending(false);
    if (updated) setReply('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-stone-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Customer Care & Help Center</h1>
          <p className="text-xs text-stone-500 mt-1">FAQs, AI assistance, and a live support chat with the AVOLAB staff team</p>
        </div>
        <button onClick={() => setIsAiBotOpen(true)} className="bg-[#2E4A32] text-amber-100 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#1C2E20] flex items-center gap-2">
          <MessageSquare size={16} /> Consult AI Bot Instantly
        </button>
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#D9E3D0] text-[#2E4A32] flex items-center justify-center"><Headphones size={19} /></div>
              <div><h2 className="font-bold text-[#1C2E20]">Chat with AVOLAB Staff</h2><p className="text-[11px] text-stone-500">Send a message and continue the same conversation here.</p></div>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-3">
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Topic" className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-[#2E4A32]" />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="How can our staff help you?" rows={4} className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2.5 text-xs outline-none resize-none focus:ring-1 focus:ring-[#2E4A32]" />
              <button disabled={creating} className="w-full bg-[#4A5D4E] text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"><Send size={14} /> {creating ? 'Sending…' : 'Start Staff Chat'}</button>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between"><h3 className="font-bold text-xs uppercase tracking-wider text-[#1C2E20]">My Support Chats</h3><span className="text-[10px] text-stone-400">{myTickets.length} conversation(s)</span></div>
            {myTickets.length === 0 ? <div className="p-8 text-center text-xs text-stone-400">No conversations yet.</div> : myTickets.map(ticket => (
              <button key={ticket.id} onClick={() => setActiveTicketId(ticket.id)} className={`w-full text-left p-4 border-b border-stone-100 hover:bg-[#FAF8F5] ${activeTicket?.id === ticket.id ? 'bg-[#F3F7EF]' : ''}`}>
                <div className="flex items-center justify-between gap-2"><span className="font-mono font-bold text-xs text-[#1C2E20]">{ticket.ticketNumber}</span><span className="text-[9px] uppercase font-bold bg-[#D9E3D0] text-[#2E4A32] px-2 py-1 rounded-full">{ticket.status.replace(/_/g, ' ')}</span></div>
                <p className="font-semibold text-xs text-stone-800 mt-1 truncate">{ticket.subject}</p>
                <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1"><Clock size={10} /> {new Date(ticket.updatedAt).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden min-h-[520px] flex flex-col">
          {activeTicket ? <>
            <div className="px-5 py-4 border-b border-stone-100 bg-[#FAF8F5] flex items-center justify-between"><div><p className="font-mono font-bold text-xs text-[#1C2E20]">{activeTicket.ticketNumber}</p><h3 className="font-bold text-sm text-stone-900 mt-0.5">{activeTicket.subject}</h3></div><div className="flex items-center gap-1.5 text-[10px] text-[#2E4A32] font-bold"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> STAFF CHAT</div></div>
            <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[430px] bg-[#FCFBF8]">
              {activeTicket.messages.map(msg => {
                const mine = msg.senderRole === 'CUSTOMER';
                return <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 ${mine ? 'bg-[#4A5D4E] text-white rounded-br-md' : 'bg-white border border-stone-200 text-stone-800 rounded-bl-md shadow-sm'}`}><div className="flex items-center gap-2 mb-1"><UserRound size={11} /><span className="text-[10px] font-bold">{msg.senderName}</span></div><p className="text-xs leading-relaxed">{msg.message}</p><p className={`text-[9px] mt-2 ${mine ? 'text-white/70' : 'text-stone-400'}`}>{new Date(msg.timestamp).toLocaleString()}</p></div></div>;
              })}
            </div>
            <form onSubmit={handleReply} className="p-4 border-t border-stone-100 flex gap-2 bg-white"><input value={reply} onChange={e => setReply(e.target.value)} placeholder="Reply to AVOLAB staff…" className="flex-1 bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-[#2E4A32]" /><button disabled={sending || !reply.trim()} className="bg-[#4A5D4E] text-white px-4 rounded-xl disabled:opacity-50"><Send size={15} /></button></form>
          </> : <div className="flex-1 flex flex-col items-center justify-center text-center p-10"><MessageSquare size={38} className="text-[#849673] mb-3" /><h3 className="font-serif font-bold text-lg text-[#1C2E20]">Your staff chat will appear here</h3><p className="text-xs text-stone-500 mt-1 max-w-sm">Start a conversation on the left and the AVOLAB team can reply from the staff workspace.</p></div>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative"><input type="text" placeholder="Search help articles & FAQs..." value={searchFaq} onChange={e => setSearchFaq(e.target.value)} className="w-full bg-white border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#2E4A32]" /><Search size={16} className="absolute left-3.5 top-3.5 text-stone-400" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{filteredFaqs.map((f, i) => <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2"><h4 className="font-bold text-xs text-[#1C2E20] flex items-start gap-2"><HelpCircle size={16} className="text-[#2E4A32] flex-shrink-0 mt-0.5" /><span>{f.q}</span></h4><p className="text-xs text-stone-600 leading-relaxed pl-6">{f.a}</p></div>)}</div>
      </div>
    </div>
  );
};
