import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { fetchNotifications, markNotificationRead } from '../services/notificationService';

export default function NotificationCenter({ route }) {
  const { userId } = route.params;
  const [list, setList] = useState([]);

  useEffect(()=>{ load(); },[]);
  async function load(){ const res = await fetchNotifications(userId); setList(res.notifications || []); }

  async function handleRead(id){
    await markNotificationRead(userId, id);
    setList(prev => prev.map(n => n.id === id ? ({...n, read:true}) : n));
  }

  return (
    <View style={{flex:1,padding:12}}>
      <FlatList data={list} keyExtractor={(i)=>i.id} renderItem={({item}) => (
        <TouchableOpacity onPress={()=>handleRead(item.id)} style={{backgroundColor: item.read ? '#f4f6f8' : '#fff', padding:12, marginBottom:8, borderRadius:8}}>
          <Text style={{fontWeight:'700'}}>{item.title}</Text>
          <Text>{item.body}</Text>
        </TouchableOpacity>
      )} />
    </View>
  );
}