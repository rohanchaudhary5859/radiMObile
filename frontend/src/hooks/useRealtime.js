/**
 * useRealtime.js
 * - Subscribe to Supabase real-time channels
 */

import { useEffect } from 'react';
import { supabase } from '../config/supabase';

export default function useRealtime(table, onChange) {
  useEffect(() => {
    if (!table) return;

    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => onChange && onChange(payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table]);
}
import { supabase } from "../config/supabase";

export function useRealtimeMessages(userId, onMessage) {
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: "public", 
        table: "messages",
        filter: `receiver_id=eq.${userId}`
      }, (payload) => {
        onMessage(payload.new);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);
}
