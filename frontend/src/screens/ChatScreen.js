import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { subscribeToConversation, sendMessage, markSeen, setPresence } from '../services/chatService';
import { supabase } from '../supabase';

export default function ChatScreen({ route }) {
  const { conversationId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    setPresence(userId, 'online');
    fetchInitial();
    const channel = subscribeToConversation(conversationId, (msg) => {
      setMessages(prev => [msg, ...prev]);
    });
    return () => {
      channel.unsubscribe();
      setPresence(userId, 'offline');
    };
  }, []);

  async function fetchInitial() {
    const { data } = await supabase.from('chat_messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: false }).limit(50);
    setMessages(data || []);
  }

  async function handleSend() {
    if(!text) return;
    await sendMessage({ conversationId, senderId: userId, content: text });
    setText('');
  }

  return (
    <View style={{flex:1,padding:12,backgroundColor:'#f7fcff'}}>
      <FlatList data={messages} inverted keyExtractor={(i)=>i.id} renderItem={({item})=>(
        <View style={{backgroundColor:'#fff',padding:8,borderRadius:8,marginBottom:8}}>
          <Text style={{fontWeight:'700'}}>{item.sender_id}</Text>
          <Text>{item.content}</Text>
          <Text style={{fontSize:10,color:'#999'}}>{new Date(item.created_at).toLocaleTimeString()}</Text>
        </View>
      )}/>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <TextInput value={text} onChangeText={setText} placeholder="Type a message" style={{flex:1,backgroundColor:'#fff',padding:12,borderRadius:8}}/>
        <TouchableOpacity onPress={handleSend} style={{marginLeft:8,backgroundColor:'#00a6ff',padding:12,borderRadius:8}}><Text style={{color:'#fff'}}>Send</Text></TouchableOpacity>
      </View>
    </View>
  )
}
useEffect(() => {
  const channel = supabase
    .channel('messages-room')
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'messages',
      filter: `receiver_id=eq.${user.id}`
    }, payload => {
      console.log("New message:", payload.new);
      setMessages((prev) => [...prev, payload.new]);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
import { supabase } from "../config/supabase";

export async function createConversation(memberIds, title = null) {
  // create convo then insert members
  const { data: conv } = await supabase.from('conversations').insert([{ title }]).select().single();
  const convId = conv.id;
  for (const uid of memberIds) {
    await supabase.from('conversation_members').insert([{ conversation_id: convId, user_id: uid }]);
  }
  return conv;
}

export async function sendMessage(conversationId, senderId, text, media = []) {
  // call edge function for authorization and notifications
  const res = await fetch(`${process.env.FUNCTIONS_URL || ''}/sendmessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId, sender_id: senderId, text, media })
  });
  return res.json();
}

export async function getConversations(userId) {
  const res = await fetch(`${process.env.FUNCTIONS_URL || ''}/getconversations`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
  return res.json();
}

export async function getMessages(conversationId, limit = 50, before = null) {
  const res = await fetch(`${process.env.FUNCTIONS_URL || ''}/getmessages`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId, limit, before })
  });
  return res.json();
}

export async function markRead(messageId, userId) {
  return fetch(`${process.env.FUNCTIONS_URL || ''}/markread`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message_id: messageId, user_id: userId })
  });
}

export async function setTyping(conversationId, userId, isTyping) {
  return fetch(`${process.env.FUNCTIONS_URL || ''}/settyping`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId, user_id: userId, is_typing: isTyping })
  });
}

export async function setPresence(userId, isOnline) {
  return fetch(`${process.env.FUNCTIONS_URL || ''}/setpresence`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ user_id: userId, is_online: isOnline })
  });
}
