import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { suggestions, followUser } from '../services/followService';

export default function Suggestions({ route }) {
  const { userId } = route.params;
  const [list, setList] = useState([]);

  useEffect(()=>{ load(); },[]);
  async function load(){ const res = await suggestions(userId); setList(res.suggestions || []); }

  return (
    <View style={{flex:1,padding:12}}>
      <Text style={{fontSize:18,fontWeight:'700'}}>People you may know</Text>
      <FlatList data={list} keyExtractor={(i)=>i.user_id} renderItem={({item}) => (
        <View style={{padding:12,backgroundColor:'#fff',marginTop:8,borderRadius:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text>{item.username || item.user_id}</Text>
          <TouchableOpacity onPress={()=>followUser(route.params.userId, item.user_id)} style={{backgroundColor:'#00a6ff',padding:8,borderRadius:6}}>
            <Text style={{color:'#fff'}}>Follow</Text>
          </TouchableOpacity>
        </View>
      )}/>
    </View>
  );
}