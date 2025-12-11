import React from 'react';
import { View, Text, Button } from 'react-native';

export default function AudioRoomScreen({ route }){
  // Integrate LiveKit SDK for real audio rooms
  return (
    <View style={{flex:1,padding:12}}>
      <Text style={{fontSize:18,fontWeight:'700'}}>Audio Room</Text>
      <Text>Audio room stub. Integrate LiveKit SDK for joining as listener/speaker.</Text>
    </View>
  );
}