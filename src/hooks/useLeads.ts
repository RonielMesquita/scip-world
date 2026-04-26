import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface Lead {
  id: string;
  created_at: string;
  viewed_at: string | null;
  company_id: string;
  company_name: string;
  user_name: string;
  user_phone: string;
  user_email: string | null;
  project_type: string | null;
  city: string | null;
  area_m2: string | null;
  deadline: string | null;
  description: string | null;
  photos: string[] | null;
  status: 'new' | 'viewed' | 'unlocked';
  unlocked: boolean;
  unlocked_at: string | null;
  company_reply: string | null;
  replied_at: string | null;
}

export interface LeadCredits {
  company_id: string;
  pro_used: number;
  pro_reset_at: string;
  credits: number;
}

// Remove qualquer canal Supabase com esse nome antes de criar um novo
function removeChannelByName(name: string) {
  const existing = supabase.getChannels().find((c) => c.topic === `realtime:${name}`);
  if (existing) supabase.removeChannel(existing);
}

// ─── Hook para empresa (recebe leads) ─────────────────────────────────────────
export function useCompanyLeads(companyId: string | undefined) {
  const [leads,   setLeads]   = useState<Lead[]>([]);
  const [credits, setCredits] = useState<LeadCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchLeads = useCallback(async () => {
    if (!companyId) return;
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    if (data) setLeads(data as Lead[]);
  }, [companyId]);

  const fetchCredits = useCallback(async () => {
    if (!companyId) return;
    const { data } = await supabase
      .from('lead_credits')
      .select('*')
      .eq('company_id', companyId)
      .single();
    setCredits(data as LeadCredits | null);
  }, [companyId]);

  useEffect(() => {
    if (!companyId) return;

    setLoading(true);
    Promise.all([fetchLeads(), fetchCredits()]).finally(() => setLoading(false));

    const name = `leads_company_${companyId}`;
    removeChannelByName(name);

    const channel = supabase
      .channel(name)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads', filter: `company_id=eq.${companyId}` },
        () => fetchLeads(),
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [companyId, fetchLeads, fetchCredits]);

  const markViewed = async (leadId: string) => {
    await supabase
      .from('leads')
      .update({ status: 'viewed', viewed_at: new Date().toISOString() })
      .eq('id', leadId)
      .eq('status', 'new');
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId && l.status === 'new'
          ? { ...l, status: 'viewed', viewed_at: new Date().toISOString() }
          : l,
      ),
    );
  };

  const unlockLead = async (leadId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('leads')
      .update({ status: 'unlocked', unlocked: true, unlocked_at: new Date().toISOString() })
      .eq('id', leadId);
    if (error) return false;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? { ...l, status: 'unlocked', unlocked: true, unlocked_at: new Date().toISOString() }
          : l,
      ),
    );
    return true;
  };

  const newCount = leads.filter((l) => l.status === 'new').length;

  return { leads, credits, loading, newCount, markViewed, unlockLead, refetch: fetchLeads };
}

// ─── Hook para usuário (suas solicitações) ────────────────────────────────────
export function useUserLeads(userEmail: string | undefined) {
  const [leads,   setLeads]   = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!userEmail) { setLoading(false); return; }

    supabase
      .from('leads')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.warn('[useUserLeads] query error:', error.message);
        if (data) setLeads(data as Lead[]);
        setLoading(false);
      });

    const name = `leads_user_${userEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    removeChannelByName(name);

    const channel = supabase
      .channel(name)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads', filter: `user_email=eq.${userEmail}` },
        (payload) => {
          setLeads((prev) =>
            prev.map((l) => (l.id === payload.new.id ? { ...l, ...payload.new } : l)),
          );
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userEmail]);

  return { leads, loading };
}
