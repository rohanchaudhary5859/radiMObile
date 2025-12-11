import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, FlatList, TouchableOpacity, Image } from "react-native";
import { fetchReels, recordInsight } from "../services/reelsService";

export default function ReelsScreen({ navigation }) {
  const [reels, setReels] = useState([]);

  useEffect(() => { load(); }, []);

  async function load(){
    const r = await fetchReels();
    setReels(r);
  }

  return (
    <FlatList
      data={reels}
      keyExtractor={(i)=>i.id}
      pagingEnabled
      renderItem={({ item }) => (
        <View style={{ height: Dimensions.get("window").height, backgroundColor:"#000" }}>
          <Image source={{ uri: item.processed_thumbnail }} style={{ height:"100%", width:"100%" }} />
          <TouchableOpacity onPress={() => recordInsight(item.id, "view")} style={{ position:"absolute", bottom:20, left:20 }}>
            <Text style={{ color:"#fff" }}>{item.caption}</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}