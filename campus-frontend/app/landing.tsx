import Button from '@/components/Shared/Button'
import Colors from '@/data/Colors'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native'

export default function Landingpage() {
    const router=useRouter();
  return (
    
    <View>
      <Image source={require("../assets/images/login.png")}
      style={
        {
            width: '100%',
            height: 600

        }
      }
      />
      <View
      style={{padding: 20}}
      >
        <Text
        style={{
            fontSize: 30,fontWeight:'bold',textAlign:'center'
        }}
        >Welcome to JoluPlex</Text>
        <Text
        style={{
            fontSize: 20,fontWeight:'semibold',textAlign:'center',marginTop :10,color:Colors.GRAY
        }}
        >
            News, clubs, events, and more. Your Jolu experience, simplified
        </Text>
        <Button text='Get Started! 🎬' onPress={()=>{router.push('/SignUp')}} />
            <Pressable onPress={()=>router.push('/SignIn')}>

                <Text
        style={{
            fontSize: 15,fontWeight:'semibold',textAlign:'center',marginTop :10
        }}
        >Already have an account ? Sign in</Text>
            </Pressable>
        
      </View>
    </View>
  )
}