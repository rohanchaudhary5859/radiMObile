/**
 * useChat.js
 * - Load chat messages
 * - Realtime message listener
 */

import { useState, useEffect } from 'react';
import { fetchMessages, sendMessage } from '../services/chatService';
import useRealtime from './useRealtime';

export default function useChat(roomId, userId) {
  const [messages, setMessages] = useState([]);

  async function load() {
    if (!roomId) return;
    const { data } = await fetchMessages(roomId);
    setMessages(data || []);
  }

  async function send(text, media = null) {
    return sendMessage(roomId, userId, text, media);
  }

  useEffect(() => { load(); }, [roomId]);

  // realtime listener
  useRealtime('messages', (payload) => {
    if (payload.new?.room_id === roomId) {
      setMessages((prev) => [...prev, payload.new]);
    }
  });

  return {
    messages,
    reload: load,
    sendMessage: send,
  };
}
