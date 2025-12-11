import React from 'react';
import { View, Text } from 'react-native';

export default function ReplayScreen({ route }){
  const { replayPath } = route.params || {};
  return (
    <View style={{flex:1,padding:12}}>
      <Text style={{fontSize:18,fontWeight:'700'}}>Replay</Text>
      <Text>Replay path: {replayPath}</Text>
    </View>
  );
}