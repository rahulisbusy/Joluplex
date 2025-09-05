import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Useravatar from '@/components/Post/Useravatar'
import { AuthContext } from '@/context/AuthContext'
import WritePost from '@/components/Post/WritePost';
export default function Addpost() {
  const {user} = useContext(AuthContext);
  return (
    <View style={{
      padding:20,

    }}>
      <Useravatar name={user?.name} image={user?.image } date='Now'/>
      <WritePost/>
    </View>
  )
}