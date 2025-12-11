import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { supabase } from '../supabase';

export default function Notifications({ navigation }){
  const [events, setEvents] = useState([]);

  useEffect(()=>{
    fetchEvents();
  },[]);

  async function fetchEvents(){
    const { data, error } = await supabase.from('analytics_events').select('*').order('created_at',{ascending:false}).limit(50);
    if(!error) setEvents(data || []);
  }

  return (
    <View style={{flex:1,backgroundColor:'#f7fcff',padding:12}}>
      <Text style={{fontSize:20,fontWeight:'700',marginBottom:12}}>Notifications</Text>
      <FlatList data={events} keyExtractor={(i)=>i.id} renderItem={({item})=>(
        <View style={{backgroundColor:'#fff',padding:12,borderRadius:10,marginBottom:8}}>
          <Text style={{fontWeight:'700'}}>{item.event_type.replace('_',' ').toUpperCase()}</Text>
          <Text style={{color:'#666',marginTop:6}}>{JSON.stringify(item.metadata)}</Text>
          <Text style={{color:'#999',marginTop:6,fontSize:12}}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>
      )}/>
    </View>
  )
}