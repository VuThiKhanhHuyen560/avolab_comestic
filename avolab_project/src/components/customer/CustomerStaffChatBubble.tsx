import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Headphones, MessageCircle, Send, X, UserRound, Clock, Plus } from 'lucide-react';

/** Persistent customer-to-staff chat bubble. The conversation is still backed by
 * support_tickets/support_ticket_messages in MySQL; this component only changes
 * the presentation from a standalone page to a floating customer-care widget.
 */
export const CustomerStaffChatBubble: React.FC = () => {
  const { customer, supportTickets, createSupportTicket, addSupportReply, showToast } = useApp();
  const [open, setOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [subject, setSubject] = useState('Order / Product Support');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);

  const myTickets = useMemo(
    () => supportTickets
      .filter(t => t.customerId === customer.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [supportTickets, customer.id]
  );

  const activeTicket = myTickets.find(t => t.id === activeTicketId) || myTickets[0];

  const unread = myTickets.filter(t => {
    const last = t.messages?.[t.messages.length - 1];
    return last && last.senderRole !== 'CUSTOMER';
  }).length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || creating) return;
    setCreating(true);
    const ticket = await createSupportTicket(subject.trim() || 'Order / Product Support', message.trim());
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
    <>
      {/* Floating customer-care button: deliberately placed on the LEFT as requested. */}
      <div className="fixed left-5 bottom-5 z-[80]">
        {open && (
          <div className="absolute left-0 bottom-[72px] w-[min(390px,calc(100vw-2.5rem))] h-[min(620px,calc(100vh-7rem))] bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-[#2E4A32] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center"><Headphones size={17} /></div>
                <div>
                  <p className="text-xs font-bold">Chat with AVOLAB Staff</p>
                  <p className="text-[9px] text-white/70">Real staff support · Replies are saved</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-full hover:bg-white/10" aria-label="Close chat"><X size={17} /></button>
            </div>

            <div className="px-3 py-2 border-b border-stone-100 flex gap-2 overflow-x-auto bg-[#FAF8F5]">
              <button onClick={() => setActiveTicketId(null)} className="shrink-0 px-3 py-1.5 rounded-full bg-[#D9E3D0] text-[#2E4A32] text-[10px] font-bold flex items-center gap-1"><Plus size={11} /> New chat</button>
              {myTickets.map(ticket => (
                <button key={ticket.id} onClick={() => setActiveTicketId(ticket.id)} className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold border ${activeTicket?.id === ticket.id ? 'bg-[#4A5D4E] text-white border-[#4A5D4E]' : 'bg-white text-stone-600 border-stone-200'}`}>
                  {ticket.ticketNumber}
                </button>
              ))}
            </div>

            {activeTicket ? (
              <>
                <div className="px-4 py-3 border-b border-stone-100 bg-white flex items-center justify-between">
                  <div><p className="font-bold text-xs text-[#1C2E20]">{activeTicket.subject}</p><p className="text-[9px] text-stone-400 flex items-center gap-1 mt-0.5"><Clock size={9} /> {new Date(activeTicket.updatedAt).toLocaleString()}</p></div>
                  <span className="text-[8px] uppercase font-bold bg-[#D9E3D0] text-[#2E4A32] px-2 py-1 rounded-full">{activeTicket.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FCFBF8]">
                  {activeTicket.messages.map(msg => {
                    const mine = msg.senderRole === 'CUSTOMER';
                    return <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[84%] rounded-2xl px-3 py-2.5 ${mine ? 'bg-[#4A5D4E] text-white rounded-br-md' : 'bg-white border border-stone-200 text-stone-800 rounded-bl-md shadow-sm'}`}>
                        <div className="flex items-center gap-1.5 mb-1"><UserRound size={10} /><span className="text-[9px] font-bold">{msg.senderName}</span></div>
                        <p className="text-[11px] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        <p className={`text-[8px] mt-1.5 ${mine ? 'text-white/65' : 'text-stone-400'}`}>{new Date(msg.timestamp).toLocaleString()}</p>
                      </div>
                    </div>;
                  })}
                </div>
                <form onSubmit={handleReply} className="p-3 border-t border-stone-100 flex gap-2 bg-white">
                  <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Reply to AVOLAB staff…" className="flex-1 min-w-0 bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2.5 text-[11px] outline-none focus:ring-1 focus:ring-[#2E4A32]" />
                  <button disabled={sending || !reply.trim()} className="w-10 rounded-xl bg-[#4A5D4E] text-white flex items-center justify-center disabled:opacity-40"><Send size={14} /></button>
                </form>
              </>
            ) : (
              <form onSubmit={handleCreate} className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="bg-[#F3F7EF] rounded-2xl p-3 text-[10px] text-[#4A5D4E]">Need help with an order, delivery, BOPIS pickup, product, or account? Send a message and the AVOLAB staff team will reply here.</div>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Topic" className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2.5 text-[11px] outline-none focus:ring-1 focus:ring-[#2E4A32]" />
                <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="How can our staff help you?" rows={7} className="w-full flex-1 min-h-[120px] bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2.5 text-[11px] outline-none resize-none focus:ring-1 focus:ring-[#2E4A32]" />
                <button disabled={creating || !message.trim()} className="w-full bg-[#4A5D4E] text-white rounded-xl py-2.5 text-[11px] font-bold flex items-center justify-center gap-2 disabled:opacity-40"><Send size={13} /> {creating ? 'Sending…' : 'Start Staff Chat'}</button>
              </form>
            )}
          </div>
        )}

        <button onClick={() => setOpen(v => !v)} className="relative w-14 h-14 rounded-full bg-[#4A5D4E] text-white shadow-xl flex items-center justify-center border-4 border-white hover:scale-105 transition-transform" aria-label="Chat with AVOLAB Staff" title="Chat with AVOLAB Staff">
          {open ? <X size={22} /> : <MessageCircle size={23} />}
          {unread > 0 && !open && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">{unread}</span>}
        </button>
      </div>
    </>
  );
};
