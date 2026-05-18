"use client";

import { useCallback, useEffect, useState } from "react";
import {
  jobApi,
  negotiationApi,
  paymentApi,
  technicianApi,
  type JobResponse,
  type NegotiationDashboardItem,
  type TechnicianResponse,
} from "@/lib/api";

export function useWorkerDashboard(userId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TechnicianResponse | null>(null);
  const [opportunities, setOpportunities] = useState<JobResponse[]>([]);
  const [assignments, setAssignments] = useState<JobResponse[]>([]);
  const [negotiations, setNegotiations] = useState<NegotiationDashboardItem[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const tech = await technicianApi.me();
      setProfile(tech);

      const [opps, assigned, negs] = await Promise.all([
        jobApi.opportunities(),
        jobApi.myAssignments(),
        negotiationApi.me(),
      ]);
      setOpportunities(opps);
      setAssignments(assigned);
      setNegotiations(negs);

      try {
        const wallet = await paymentApi.wallet(tech.id);
        setWalletBalance(wallet.balance);
      } catch {
        setWalletBalance(0);
      }
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading,
    profile,
    opportunities,
    assignments,
    negotiations,
    walletBalance,
    refresh,
  };
}
