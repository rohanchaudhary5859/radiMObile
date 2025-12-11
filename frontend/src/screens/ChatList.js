import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { getConversations } from "../../services/chatService";

export default function ChatScreen({ navigation }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await getConversations(user.id);
    setConversations(res.conversations || []);
  }

  return (
    <View style={{flex:1, padding:10}}>
      <FlatList
        data={conversations}
        keyExtractor={i => i.conversation_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ChatRoom', { conversationId: item.conversation_id })} style={{padding:12, borderBottomWidth:1, borderColor:'#eee'}}>
            <Text style={{fontWeight:'bold'}}>{item.title || item.member_ids.filter(id => id !== user.id)[0]}</Text>
            <Text numberOfLines={1}>{item.last_message?.text || 'No messages yet'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
