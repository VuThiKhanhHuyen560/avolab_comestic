import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Package, AlertTriangle, Tag, ShieldAlert, X, ExternalLink } from 'lucide-react';

export const NotificationCenter: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, role, currentUser, setActiveTab } = useApp();

  const filteredNotifs = notifications.filter(n => {
    const roleMatch = n.recipientRole === role || n.recipientRole === 'ALL';
    const userMatch = !n.recipientUserId || n.recipientUserId === currentUser?.id;
    return roleMatch && userMatch;
  });

  const roleLabel = role === 'CUSTOMER' ? 'Customer Notifications' : role === 'STAFF' ? 'Staff Operations' : 'Admin Notifications';

  const openNotification = (notif: any) => {
    markNotificationAsRead(notif.id);
    const link = notif.link as string | undefined;
    if (link) {
      setActiveTab(link as any);
    } else if (role === 'CUSTOMER' && notif.type === 'ORDER') {
      setActiveTab('ORDERS');
    } else if (role === 'STAFF' && notif.type === 'ORDER') {
      setActiveTab(notif.title?.includes('BOPIS') || notif.message?.includes('counter pickup') ? 'STAFF_BOPIS' : 'STAFF_ORDERS');
    } else if (role === 'ADMIN' && notif.type === 'ORDER') {
      setActiveTab('ADMIN_ORDERS');
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER': return <Package size={16} className="text-[#4A5D4E]" />;
      case 'INVENTORY': return <AlertTriangle size={16} className="text-amber-600" />;
      case 'PROMO': return <Tag size={16} className="text-[#849673]" />;
      default: return <ShieldAlert size={16} className="text-stone-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 z-50 overflow-hidden text-stone-800 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 bg-[#F5F2EB] border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-[#4A5D4E]" />
          <div><h3 className="font-semibold text-stone-900 text-sm">{roleLabel}</h3><p className="text-[10px] text-stone-500 mt-0.5">Only notifications for this role are shown</p></div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-stone-400 hover:text-stone-700 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
        {filteredNotifs.length === 0 ? (
          <div className="p-6 text-center text-xs text-stone-500">
            No notifications right now.
          </div>
        ) : (
          filteredNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => openNotification(notif)}
              className={`p-3.5 hover:bg-stone-50 transition-colors cursor-pointer flex gap-3 ${
                !notif.read ? 'bg-amber-50/40 border-l-2 border-[#4A5D4E]' : ''
              }`}
            >
              <div className="p-2 bg-stone-100 rounded-full h-fit flex-shrink-0">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-stone-900 truncate">{notif.title}</p>
                  <span className="text-[10px] text-stone-400 flex-shrink-0">
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
        <button
          onClick={() => {
            filteredNotifs.forEach(n => markNotificationAsRead(n.id));
          }}
          className="text-xs font-medium text-[#4A5D4E] hover:underline flex items-center gap-1"
        >
          <CheckCheck size={14} /> Mark all read
        </button>

        <button
          onClick={() => {
            setActiveTab('NOTIFICATIONS');
            onClose();
          }}
          className="text-xs font-bold text-[#4A5D4E] hover:underline flex items-center gap-1"
        >
          <span>View All History</span>
          <ExternalLink size={13} />
        </button>
      </div>
    </div>
  );
};
