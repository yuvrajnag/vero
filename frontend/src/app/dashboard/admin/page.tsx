"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldAlert,
  LogOut,
  ChevronLeft,
  CheckCircle2,
  UserX,
} from "lucide-react";
import { useAuth, ProtectedRoute } from "@/lib/auth-context";
import { adminApi, type AdminDashboardSummary, type AdminUser } from "@/lib/api";

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dash, userList] = await Promise.all([
        adminApi.dashboard(),
        adminApi.users(0, 50),
      ]);
      setSummary(dash);
      setUsers(userList);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const stats = summary
    ? [
        { label: "Total Users", value: summary.total_users, icon: Users },
        { label: "Technicians", value: summary.total_technicians, icon: Briefcase },
        { label: "Online Now", value: summary.active_technicians, icon: CheckCircle2 },
        { label: "Open Jobs", value: summary.open_jobs, icon: LayoutDashboard },
        { label: "Fraud Flags", value: summary.open_fraud_flags, icon: ShieldAlert },
      ]
    : [];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <motion.div className="min-h-screen premium-bg text-zinc-300">
        <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
          <Link
            href="/"
            className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 transition-colors"
          >
            <ChevronLeft size={14} className="text-zinc-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Home</span>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="pointer-events-auto p-2 rounded-lg border border-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>

        <main className="max-w-6xl mx-auto px-6 pt-24 pb-16">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight">Platform Admin</h1>
            <p className="text-sm text-zinc-500 mt-2">
              Signed in as {user?.email}
            </p>
          </div>

          {error && (
            <p className="mb-6 text-sm text-red-400 border border-red-900/40 bg-red-950/30 px-4 py-3 rounded-xl">
              {error}
            </p>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-800 border-t-zinc-400" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {stats.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="p-5 rounded-2xl border border-zinc-850 bg-zinc-950/60"
                    >
                      <Icon size={16} className="text-zinc-500 mb-3" />
                      <p className="text-2xl font-black text-white">{s.value}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">
                        {s.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-zinc-850 bg-zinc-950/60 overflow-hidden">
                <motion.div className="px-6 py-4 border-b border-zinc-850 flex items-center justify-between">
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">
                    User Registry
                  </h2>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {users.length} shown
                  </span>
                </motion.div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-850 text-zinc-500 uppercase tracking-wider">
                        <th className="px-6 py-3 font-bold">Email</th>
                        <th className="px-6 py-3 font-bold">Name</th>
                        <th className="px-6 py-3 font-bold">Role</th>
                        <th className="px-6 py-3 font-bold">Status</th>
                        <th className="px-6 py-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-zinc-900/80 hover:bg-zinc-900/30">
                          <td className="px-6 py-3 text-zinc-300">{u.email}</td>
                          <td className="px-6 py-3 text-zinc-400">{u.full_name || "—"}</td>
                          <td className="px-6 py-3">
                            <span className="font-mono text-[10px] uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            {u.is_active ? (
                              <span className="text-emerald-400">Active</span>
                            ) : (
                              <span className="text-red-400">Inactive</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-right">
                            {u.is_active && u.id !== user?.id && (
                              <button
                                type="button"
                                onClick={async () => {
                                  await adminApi.deactivateUser(u.id);
                                  await load();
                                }}
                                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-red-400"
                              >
                                <UserX size={12} /> Deactivate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </motion.div>
    </ProtectedRoute>
  );
}
