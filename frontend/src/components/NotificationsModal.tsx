import React from 'react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: NotificationItem) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/40 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 pt-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#dae2fd] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 bg-[#faf8ff] border-b border-[#eaedff] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948] text-[22px]">notifications</span>
            <h3 className="font-bold text-sm text-[#131b2e]">Notification Center</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-xs font-semibold text-[#006948] hover:underline"
            >
              Mark all read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#eaedff] flex items-center justify-center text-[#3d4a42]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-2 overflow-y-auto divide-y divide-[#eaedff]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6d7a72]">No notifications yet</div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-colors ${
                  notif.read ? 'hover:bg-[#f2f3ff]' : 'bg-[#e2e7ff]/40 hover:bg-[#e2e7ff]/70'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                    notif.type === 'urgent'
                      ? 'bg-[#fd651e]'
                      : notif.type === 'claim'
                      ? 'bg-[#006948]'
                      : notif.type === 'dispatch'
                      ? 'bg-[#2170e4]'
                      : 'bg-[#6d7a72]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {notif.type === 'urgent'
                      ? 'alarm'
                      : notif.type === 'claim'
                      ? 'handshake'
                      : notif.type === 'dispatch'
                      ? 'directions_car'
                      : 'check'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-[#131b2e] truncate">{notif.title}</span>
                    <span className="text-[10px] text-[#6d7a72] flex-shrink-0">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#3d4a42] mt-0.5 line-clamp-2">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
