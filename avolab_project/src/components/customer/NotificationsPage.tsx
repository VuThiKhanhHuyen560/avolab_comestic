import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Package, 
  Tag, 
  Gift, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle,
  Filter
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationAsRead, role, currentUser, showToast } = useApp();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ORDER' | 'PROMO' | 'LOYALTY' | 'SUPPORT'>('ALL');
  const [localNotifs, setLocalNotifs] = useState<NotificationItem[]>(notifications);

  useEffect(() => {
    setLocalNotifs(notifications);
  }, [notifications]);

  const filteredNotifs = localNotifs.filter(n => {
    const roleMatch = n.recipientRole === role || n.recipientRole === 'ALL';
    const userMatch = !n.recipientUserId || n.recipientUserId === currentUser?.id;
    if (!roleMatch || !userMatch) return false;
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'SUPPORT') return n.type === 'SYSTEM';
    return n.type === activeFilter;
  });

  const handleMarkAllRead = () => {
    setLocalNotifs(prev => prev.map(n => ({ ...n, read: true })));
    localNotifs.forEach(n => markNotificationAsRead(n.id));
    showToast('Marked all notifications as read');
  };

  const handleDeleteNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalNotifs(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Package size={18} className="text-[#4A5D4E]" />;
      case 'PROMO': return <Tag size={18} className="text-[#849673]" />;
      case 'LOYALTY': return <Gift size={18} className="text-amber-700" />;
      default: return <ShieldAlert size={18} className="text-stone-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 selection:bg-[#D9E3D0] selection:text-[#4A5D4E]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1D6] pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2E20] flex items-center gap-2.5">
            <Bell size={28} className="text-[#4A5D4E]" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-[#5A5A5A] mt-1">
            Your role-specific order, operational, support, promotion, and loyalty alerts
          </p>
        </div>

        {filteredNotifs.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="bg-[#D9E3D0] text-[#4A5D4E] hover:bg-[#4A5D4E] hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
          >
            <CheckCheck size={16} /> Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6E1D6]/60 text-xs font-bold no-scrollbar">
        <Filter size={14} className="text-[#849673] flex-shrink-0 mr-1" />
        
        {(['ALL', 'ORDER', 'PROMO', 'LOYALTY', 'SUPPORT'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 rounded-full uppercase tracking-wider transition-all whitespace-nowrap ${
              activeFilter === tab
                ? 'bg-[#4A5D4E] text-white shadow-2xs'
                : 'bg-[#F9F7F2] text-[#5A5A5A] border border-[#E6E1D6] hover:bg-[#F0EBE1]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E6E1D6] space-y-3 shadow-2xs">
            <CheckCircle size={40} className="text-[#849673] mx-auto opacity-60" />
            <h3 className="font-serif text-lg font-bold text-[#1C2E20]">You're all caught up!</h3>
            <p className="text-xs text-[#5A5A5A]">No notifications found for this category.</p>
          </div>
        ) : (
          filteredNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`bg-white rounded-2xl border p-4 transition-all flex items-start gap-4 shadow-2xs cursor-pointer ${
                !notif.read
                  ? 'border-[#4A5D4E] bg-[#D9E3D0]/10 border-l-4'
                  : 'border-[#E6E1D6] hover:border-[#849673]'
              }`}
            >
              <div className="p-3 bg-[#F9F7F2] rounded-2xl border border-[#E6E1D6] flex-shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs sm:text-sm text-[#1A1A1A] flex items-center gap-2">
                    <span>{notif.title}</span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#849673]" />
                    )}
                  </h4>
                  <span className="text-[10px] text-[#888] font-mono">
                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-[#5A5A5A] mt-1 leading-relaxed">{notif.message}</p>
              </div>

              <button
                type="button"
                onClick={(e) => handleDeleteNotif(notif.id, e)}
                className="text-stone-300 hover:text-rose-600 p-1 transition-colors flex-shrink-0"
                title="Delete Notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
