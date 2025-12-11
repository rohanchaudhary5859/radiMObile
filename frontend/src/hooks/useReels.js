/**
 * useReels.js
 * - Fetch reels feed
 * - Load more reels (pagination)
 * - Realtime updates
 */

import { useEffect, useState } from 'react';
import { fetchReels } from '../services/reelService';
import useRealtime from './useRealtime';

export default function useReels() {
  const [reels, setReels] = useState([]);
  const [cursor, setCursor] = useState(null);

  async function load() {
    const { data } = await fetchReels({ limit: 20 });
    setReels(data || []);
    if (data?.length) setCursor(data[data.length - 1].created_at);
  }

  async function loadMore() {
    if (!cursor) return;
    const { data } = await fetchReels({ limit: 20, cursor });
    if (data?.length) {
      setReels((prev) => [...prev, ...data]);
      setCursor(data[data.length - 1].created_at);
    }
  }

  useEffect(() => { load(); }, []);

  useRealtime('reels', () => load());

  return { reels, loadMore, refresh: load };
}
