import React from 'react';
import { View, Text, Button } from 'react-native';

export default function LiveViewerScreen({ route }){
  // For playback use LiveKit's MediaStream or HLS endpoint depending on deployment.
  return (
    <View style={{flex:1,padding:12}}>
      <Text style={{fontSize:18,fontWeight:'700'}}>Live Viewer</Text>
      <Text>Video playback stub - integrate LiveKit SDK or HLS player.</Text>
    </View>
  );
}