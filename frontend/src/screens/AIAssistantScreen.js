import React, { useState } from 'react';
import { View, TextInput, Button, Text, FlatList } from 'react-native';
import { assistantMessage } from '../services/aiService';

export default function AIAssistantScreen({ route }) {
  const [message, setMessage] = useState('');
  const [convo, setConvo] = useState([]);

  async function send(){
    const res = await assistantMessage(route.params.userId, null, message);
    if(res.reply){
      setConvo(prev => [...prev, { from: 'user', text: message }, { from: 'ai', text: res.reply }]);
      setMessage('');
    }
  }

  return (
    <View style={{flex:1,padding:12}}>
      <FlatList data={convo} keyExtractor={(i,idx)=>idx.toString()} renderItem={({item})=> <Text style={{marginVertical:6}}>{item.from}: {item.text}</Text>} />
      <TextInput value={message} onChangeText={setMessage} placeholder="Ask about the case..." style={{borderWidth:1,padding:8,marginBottom:8}} />
      <Button title="Ask" onPress={send} />
    </View>
  );
}