import React from 'react';
import { X, Bell, CheckCheck } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm backdrop-smooth flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] max-h-[85vh] flex flex-col shadow-2xl modal-enter-smooth">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#0062FF] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Pusat Notifikasi</h2>
              <p className="text-[11px] font-normal text-slate-500">Pengingat tugas & info jadwal AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-[#0062FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Baca Semua</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-2.5 text-xs">
          {notifications.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 bg-blue-50 text-[#0062FF] rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">Belum Ada Notifikasi</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Pengingat tugas mendesak dan notifikasi belajar akan otomatis muncul di sini.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 rounded-3xl border transition-all ${
                  notif.isRead 
                    ? 'bg-white border-slate-100 shadow-xs' 
                    : 'bg-blue-50/60 border-blue-200/70 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-normal whitespace-nowrap">
                    {notif.timeAgo}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed font-normal">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
