import { View, Text, FlatList } from 'react-native'
import React, { useContext } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Clubcard from '@/components/Clubs/Clubcard';
import { AuthContext } from '@/context/AuthContext';

export type Club={
    id:number;
    name:string;
    logo:string;
    about:string;
    createdon:string;
    isFollowed:boolean;
}
export default function ExploreClubs() {
    const [clublist, setClublist] = useState<Club[]>([]);
    const [followedclubs, setFollowedclubs] = useState<any>([]);
    const {user}= useContext(AuthContext);
    useEffect(()=>{getAllclubs()},[])
    const getAllclubs=async()=>{
    const result=await axios.get(process.env.EXPO_PUBLIC_HOST+'/api/clubs');
    console.log(result.data);
    setClublist(result.data);
    getUserFollowedClub();
    }
    useEffect(()=>{
    getUserFollowedClub()
    },[])
    const getUserFollowedClub=async()=>{
    const result = await axios.get(process.env.EXPO_PUBLIC_HOST+"/api/followclub?u_email="+user?.email);
    console.log(result.data);
    setFollowedclubs(result.data.data ?? []);
    }
    const isFollowed = (clubId:number) => {
  return followedclubs.some((item:any) => item.club_id === clubId);
}

  return (
    <View style={{ flex: 1 }}>
  <FlatList
  data={clublist}
  numColumns={2}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <Clubcard club={item} isFollowed={isFollowed(item.id)} />
  )}
  columnWrapperStyle={{ justifyContent: "space-evenly" }}
  contentContainerStyle={{ paddingVertical: 16 }}
/>

</View>

  )
}