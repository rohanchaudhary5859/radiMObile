import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { getMessages, sendMessage, setTyping, markRead } from "../../services/chatService";
import { useRealtimeMessages } from "../../hooks/useRealtimeMessages";

export default function ChatRoom({ route }) {
  const { conversationId, otherUser } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const flatRef = useRef();

  useEffect(() => {
    load();
  }, [conversationId]);

  async function load() {
    const res = await getMessages(conversationId, 100);
    setMessages(res.messages || []);
    // mark all visible messages as read
    (res.messages || []).forEach(m => {
      if (m.sender_id !== user.id) markRead(m.id, user.id);
    });
  }

  useRealtimeMessages(conversationId, (msg) => {
    setMessages(prev => [...prev, msg]);
    // auto-mark read if open
    if (msg.sender_id !== user.id) markRead(msg.id, user.id);
  });

  const handleSend = async () => {
    if (!text.trim()) return;
    const res = await sendMessage(conversationId, user.id, text.trim());
    setText("");
  };

  const handleTyping = (val) => {
    setText(val);
    setTyping(conversationId, user.id, val.length > 0);
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior="padding">
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender_id === user.id ? styles.right : styles.left]}>
            <Text>{item.text}</Text>
            <Text style={styles.ts}>{new Date(item.created_at).toLocaleTimeString()}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleTyping}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={{color:'#fff'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  message: { padding:10, margin:8, borderRadius:8, maxWidth:'75%' },
  left: { backgroundColor:'#f0f0f0', alignSelf:'flex-start' },
  right: { backgroundColor:'#007bff', alignSelf:'flex-end', color:'#fff' },
  inputRow: { flexDirection:'row', padding:10, borderTopWidth:1, borderColor:'#eee' },
  input: { flex:1, padding:10, borderRadius:8, backgroundColor:'#fff', borderWidth:1, borderColor:'#ddd' },
  sendBtn: { padding:12, backgroundColor:'#0a84ff', marginLeft:8, borderRadius:8 },
  ts: { fontSize:10, color:'#666', marginTop:6 }
});
