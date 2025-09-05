import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { Image } from 'react-native'
import Colors from '@/data/Colors'
import Ionicons from '@expo/vector-icons/Ionicons';
type Props={
    name?:string,
    image?:string,
    date?:string
}

export default function Useravatar({name,image,date}:Props) {
    
  return (
    <View
    style={{
    display:'flex',
    flexDirection:'row',
     alignItems:'center',
    justifyContent:'space-between'

    }}
    >
     <View
    style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:10,
      }}
    >
         <Image
                    source={image ? { uri: image } : require('../../assets/images/profile.png')}
                    style={{ width: 50, height: 50, borderRadius: 50 }}
                />
      <View >
       
        
         <Text style={{
            textAlign:'center',
            fontSize:16,
            fontWeight:'600'
        }}>{name}</Text>
      <Text
      style={{
        color:Colors.GRAY
      }}
      >{date}</Text>

      </View>
      
     
    </View>
    <Ionicons name="ellipsis-vertical-sharp" size={24} color="black" />
    </View>
    
  )
}