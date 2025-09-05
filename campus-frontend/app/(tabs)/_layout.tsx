import { View, Text, Image } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { router, Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../context/AuthContext';
import Colors from '@/data/Colors';
export default function Tablayout() {
    const {user}=useContext(AuthContext);
    useEffect(()=>{
    if(!user){
      router.replace('/landing');
    }
    },[user])
    
  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor:Colors.PRIMARY,
        headerShown:false,
        

        
    }}
    >
        <Tabs.Screen name='Home' 
        options={{tabBarIcon:({color,size})=><Ionicons name="home-sharp" size={24} color={color} />}}
        />
        <Tabs.Screen name='Events'
        options={{tabBarIcon:({color,size})=> <MaterialCommunityIcons name="party-popper" size={24} color={color} />}}
        />
        <Tabs.Screen name='Clubs'
        options={{tabBarIcon:({color,size})=><MaterialCommunityIcons name="account-group" size={24} color={color} />}}
        />
        <Tabs.Screen
  name='Profile'
  options={{
    tabBarIcon: ({ color, size }) =>
      user && user.image ? (
        <Image
          source={{ uri: user.image }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Ionicons name="person-circle-sharp" size={size} color={color} />
      ),
  }}
/>
    </Tabs>
  )
}