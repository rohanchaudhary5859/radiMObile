/**
 * useExplore.js
 * - Search results
 * - Trending topics
 */

import { useState } from 'react';
import { search, getTrendingTopics } from '../services/exploreService';

export default function useExplore() {
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);

  async function doSearch(query) {
    const data = await search(query);
    setResults(data?.results || []);
  }

  async function loadTrending() {
    const data = await getTrendingTopics();
    setTrending(data?.topics || []);
  }

  return {
    results,
    trending,
    doSearch,
    loadTrending,
  };
}
