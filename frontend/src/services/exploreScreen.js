import React, { useState } from "react";
import { View, TextInput, FlatList, Text } from "react-native";
import { search, getTrending } from "../services/exploreService";

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch(text) {
    setQuery(text);
    if (text.length < 2) return;

    const res = await search(text);
    setResults(res.data.results);
  }

  return (
    <View style={{ padding: 12 }}>
      <TextInput
        placeholder="Search doctors, posts, cases..."
        value={query}
        onChangeText={handleSearch}
        style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.source_id}
        renderItem={({ item }) => (
          <Text style={{ padding: 10 }}>{item.text}</Text>
        )}
      />
    </View>
  );
}
