import { View, Text, FlatList } from 'react-native'
import React, { useContext } from 'react'
import Colors from '@/data/Colors'
import Header from '@/components/Home/Header'
import Category from '@/components/Home/Category'
import LatestPost from '@/components/Home/LatestPost'
import { AuthContext } from '@/context/AuthContext'


export default function Home() {
  const {user}=useContext(AuthContext);
  
  return (
    //@ts-ignore
    <FlatList
    
    renderItem={null}
    ListHeaderComponent={
       <View
    style={{
        padding:20,
        paddingTop:100,
    }}
    >
    {/* Header */ }
    <Header />
    {/* Category */ }
    <Category/>
    {/* Latest Post */ }
    <LatestPost/>
    </View>
    }
    >
     
    </FlatList>
    
  )
}