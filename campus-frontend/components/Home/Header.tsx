import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Colors from '@/data/Colors'
import { Image } from 'react-native'
import { AuthContext } from '@/context/AuthContext'

export default function Header() {
    const {user}=useContext(AuthContext);
  return (
    <View 
    style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    }}
    >
        <View
        style={{
            gap:2,
        }}
        >
          <Text
      style={{
        fontFamily:'Poppins-Bold',
        fontWeight:'900',
        fontSize:24,
        color:Colors.PRIMARY,
      }}
      >Welcome Jolites!</Text>
        <Text
        style={{
            fontFamily:'Poppins-Regular',
            fontSize:16,
            color:Colors.GRAY,
        }}
        >Jalpaiguri Government Engineering College </Text>
        </View>
        <View>
          {
            user && user.image ? (
                <Image
                  source={{ uri: user.image }}
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                />
              ) : (
                <Image
                source={require('../../assets/images/profile.png')}
                style={{
                    width:50,
                    height:50,
                    borderRadius:25,
                }}
                />
              )
        }
        </View>
        
        
    </View>
  )
}