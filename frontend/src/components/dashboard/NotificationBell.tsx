"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { notificationApi, type NotificationResponse } from "@/lib/api";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationApi.list(false);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 30000);
    return () => clearInterval(interval);
  }, [load]);

  const unread = items.filter((n) => !n.is_read).length;

  const markRead = async (id: string) => {
    await notificationApi.markRead(id);
    await load();
  };

  const markAll = async () => {
    await notificationApi.markAllRead();
    await load();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} className="text-zinc-300" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-850">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => void markAll()}
                className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-wider"
              >
                Mark all read
              </button>
            )}
          </div>
          {loading ? (
            <p className="p-4 text-xs text-zinc-500">Loading…</p>
          ) : items.length === 0 ? (
            <p className="p-4 text-xs text-zinc-500">No notifications yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-850">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => void markRead(n.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-zinc-900/80 transition-colors ${n.is_read ? "opacity-60" : ""}`}
                  >
                    <p className="text-xs font-bold text-white">{n.title}</p>
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{n.message}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
