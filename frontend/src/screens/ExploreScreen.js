import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { searchQuery, trendingHashtags, autocompleteUsers } from '../services/searchService';

export default function ExploreScreen({ navigation }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [trending, setTrending] = useState([]);

  useEffect(()=>{ loadTrending(); },[]);

  async function loadTrending(){
    const t = await trendingHashtags(); setTrending(t.trending || []);
  }

  async function onSearch(){
    const r = await searchQuery(q, {});
    setResults(r.results || []);
    navigation.navigate('SearchResults', { results: r.results || [], query: q });
  }

  return (
    <View style={{flex:1,padding:12}}>
      <TextInput placeholder="Search doctors, cases, hashtags..." value={q} onChangeText={setQ} style={{borderWidth:1,padding:8,borderRadius:8}} />
      <TouchableOpacity onPress={onSearch} style={{marginTop:8,backgroundColor:'#00a6ff',padding:10,borderRadius:8}}><Text style={{color:'#fff'}}>Search</Text></TouchableOpacity>

      <Text style={{marginTop:20,fontSize:18,fontWeight:'700'}}>Trending Hashtags</Text>
      <FlatList data={trending} horizontal keyExtractor={(i)=>i.tag} renderItem={({item})=> <TouchableOpacity style={{padding:8,backgroundColor:'#fff',margin:6,borderRadius:8}} onPress={()=>{ setQ(item.tag); onSearch(); }}><Text>{item.tag}</Text></TouchableOpacity> } />
    </View>
  );
}