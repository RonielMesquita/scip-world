import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface LeadsNotificationContextType {
  newLeadsCount: number;
  clearBadge: () => void;
}

const LeadsNotificationContext = createContext<LeadsNotificationContextType>({
  newLeadsCount: 0,
  clearBadge: () => {},
});

function removeChannelByName(name: string) {
  const existing = supabase.getChannels().find((c) => c.topic === `realtime:${name}`);
  if (existing) supabase.removeChannel(existing);
}

export function LeadsNotificationProvider({ children }: { children: React.ReactNode }) {
  const { myCompany } = useAuth();
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!myCompany?.id) { setNewLeadsCount(0); return; }

    const fetchCount = async () => {
      const { count } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', myCompany.id)
        .eq('status', 'new');
      setNewLeadsCount(count ?? 0);
    };

    fetchCount();

    const name = `leads_notif_${myCompany.id}`;
    removeChannelByName(name);

    const channel = supabase
      .channel(name)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'leads', filter: `company_id=eq.${myCompany.id}` },
        () => setNewLeadsCount((n) => n + 1),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'leads', filter: `company_id=eq.${myCompany.id}` },
        () => fetchCount(),
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [myCompany?.id]);

  const clearBadge = () => setNewLeadsCount(0);

  return (
    <LeadsNotificationContext.Provider value={{ newLeadsCount, clearBadge }}>
      {children}
    </LeadsNotificationContext.Provider>
  );
}

export const useLeadsNotification = () => useContext(LeadsNotificationContext);
