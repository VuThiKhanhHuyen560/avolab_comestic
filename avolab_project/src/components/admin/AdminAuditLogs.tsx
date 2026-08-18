import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Clock, Search, Filter, Lock } from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const actorName = log.userName || (log as any).actor || '';
    const details = log.details || '';
    const action = log.action || '';
    return (
      action.toLowerCase().includes(search.toLowerCase()) ||
      actorName.toLowerCase().includes(search.toLowerCase()) ||
      details.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Immutable Security & System Audit Trail</h1>
        <p className="text-xs text-stone-500 mt-0.5">Real-time audit logging of BOPIS verifications, inventory adjustments, and order state updates</p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search audit trail by actor, action, or entity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#2E4A32]"
        />
        <Search size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-semibold">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor / Role</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity ID</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-stone-50">
                <td className="p-4 text-stone-400">
                  {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                </td>
                <td className="p-4 font-sans font-bold text-stone-900">
                  {log.userName || (log as any).actor || 'System'} <span className="bg-stone-100 text-stone-600 text-[10px] px-1.5 py-0.5 rounded font-mono ml-1">{log.userRole || (log as any).role || 'ADMIN'}</span>
                </td>
                <td className="p-4">
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-stone-600">{log.entityId || (log as any).targetEntityId || '-'}</td>
                <td className="p-4 text-stone-600 font-sans">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
