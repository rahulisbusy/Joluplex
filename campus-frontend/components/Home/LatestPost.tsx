import { View, Text, Pressable } from 'react-native'
import React, { useState,useEffect, useContext } from 'react';
import Colors from '@/data/Colors';
import axios from 'axios';
import PostList from '../Post/PostList';
import { AuthContext } from '@/context/AuthContext';

export default function LatestPost() {
  const [selectedTab, setSelectedTab] = useState<'latest' | 'trending'>('latest');
  const [posts, setPosts] = useState([]);
  const {user}=useContext(AuthContext);
  const [items, setItems] = useState([]);
  useEffect(() => {
    GetPosts();
  },[posts]);
  
  const GetPosts = async () => {
  try {
    const result = await axios.get(
      process.env.EXPO_PUBLIC_HOST + "/api/getposts",
      {
        params: {
          visiblein: "0",
          orderfield: "id", // or another allowed column
        },
      }
    );
    
    setPosts(result.data);
  } catch (err) {
    console.log("Failed to fetch posts", err);
  }
};
  return (
    <View style={{ marginTop: 10 }}>
      <View style={{
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginBottom: 10
      }}>
        <Pressable onPress={() => setSelectedTab('latest')}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              marginBottom: 10,
              backgroundColor: selectedTab === 'latest' ? Colors.PRIMARY : 'transparent',
              color: selectedTab === 'latest' ? '#fff' : '#000',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >Latest</Text>
        </Pressable>
        <Pressable onPress={() => setSelectedTab('trending')}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '700',
              marginBottom: 10,
              backgroundColor: selectedTab === 'trending' ? Colors.PRIMARY : 'transparent',
              color: selectedTab === 'trending' ? '#fff' : '#000',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >Trending</Text>
        </Pressable>
      </View>
      <PostList posts={posts} />
    </View>
  )
}