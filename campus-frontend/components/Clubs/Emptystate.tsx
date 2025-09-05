import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'react-native';
import Button from '../Shared/Button';
import { router } from 'expo-router';
import Colors from '@/data/Colors';
export default function Emptystate() {
   
  return (
    <View style={{marginTop:50,alignItems:'center',justifyContent:'center'}}>
      <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: Colors.SECONDARY,
                  textAlign: 'center',
                }}
              >
                Explore your interests 🥍🎸💃
              </Text>
      <Text style={{
        fontSize:16,
        color:'gray',
        marginTop:20,
        textAlign:'center'
      }}>You are not following any clubs.</Text>
      <Image source={require('../../assets/images/no-club.png')} style={{width:200,height:200,alignSelf:'center',marginTop:20}}/>
      <Button text='Explore Clubs 🔎' onPress={()=>router.push('/explore-clubs')}/>
    </View>
  )
}