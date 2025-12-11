import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

export default function LiveHostScreen({ route }){
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  async function createAndStart(){
    // call create live session endpoint (client should create session row via supabase)
    // then call generate_stream_key and start_live, and open RTMP stream via device camera (outside scope)
    alert('This is a scaffold. Integrate camera/RTMP library (e.g., react-native-rtmp) for ingest.');
  }

  return (
    <View style={{padding:12}}>
      <Text style={{fontSize:20,fontWeight:'700'}}>Start Live</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{borderWidth:1,padding:8,marginTop:12}} />
      <TextInput placeholder="Description" value={desc} onChangeText={setDesc} style={{borderWidth:1,padding:8,marginTop:8}} />
      <Button title="Start Live" onPress={createAndStart} />
    </View>
  );
}