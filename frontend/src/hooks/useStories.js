/**
 * useStories.js
 * - Fetch all active stories
 * - Realtime updates when new story is added
 */

import { useEffect, useState } from 'react';
import { fetchActiveStories } from '../services/storyService';
import useRealtime from './useRealtime';

export default function useStories() {
  const [stories, setStories] = useState([]);

  async function load() {
    const { data } = await fetchActiveStories();
    setStories(data || []);
  }

  useEffect(() => { load(); }, []);

  // Realtime new stories
  useRealtime('stories', () => load());

  return { stories, reload: load };
}
