import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { createPlan } from '../services/subscriptionService';

export default function AdminPlans({ route }){
  const [plans, setPlans] = useState([]);
  const [name,setName] = useState('');
  const [price,setPrice] = useState('');

  async function handleCreate(){
    // admin creates plans via Stripe dashboard; this is a simple local register helper
    await fetch(`${process.env.SUPABASE_FUNCTIONS_URL}/create_plan`, { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ name, price_cents: parseInt(price)*100, currency:'usd', interval:'month', stripe_price_id: '' }) });
  }

  return (
    <View style={{flex:1,padding:12}}>
      <Text style={{fontSize:20,fontWeight:'700'}}>Plans</Text>
      <TextInput placeholder="Plan name" value={name} onChangeText={setName} style={{backgroundColor:'#fff',padding:8,marginTop:12}}/>
      <TextInput placeholder="Price (USD)" value={price} onChangeText={setPrice} style={{backgroundColor:'#fff',padding:8,marginTop:8}}/>
      <TouchableOpacity onPress={handleCreate} style={{backgroundColor:'#00a6ff',padding:12,borderRadius:8,marginTop:12}}><Text style={{color:'#fff'}}>Create</Text></TouchableOpacity>
    </View>
  );
}