import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Image } from 'react-native'
import Colors from '@/data/Colors'
import { router } from 'expo-router'
const Categories = [
{
name:'Upcoming Events',
banner:require('../../assets/images/event.png'),
path:'/(tabs)/Events',
},
{
name:'Latest Post',
banner:require('../../assets/images/news.png'),
path:'/(tabs)/Events',
},
{
name:'Explore Clubs',
banner:require('../../assets/images/clubs.png'),
path:'/(tabs)/Clubs',
},
{
name:'Add a new post',
banner:require('../../assets/images/add-post.png'),
path:'/add-post',
},


]

export default function Category() {
  return (
    <View style={{marginTop:20}}>
      <FlatList 
  data={Categories}
  numColumns={2}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({item, index}) => (
    <TouchableOpacity onPress={()=>{
        router.push(item.path);
    }}>

    <View style={{ flex: 1, alignItems: 'center', margin: 8 }}>
      <Image source={item.banner} style={styles.bannerimage} />
      <Text style={styles.text}>{item.name}</Text>
    </View>
    </TouchableOpacity>
  )}
/>
    </View>
  )
}
const styles=StyleSheet.create({
    bannerimage:{
        height:80,
        width:Dimensions.get('screen').width*0.40,
        borderRadius:10,
        marginBottom:20,
    },
    text:{
        position:'absolute',
         marginTop: 2 ,
         padding:2,
            fontWeight:'500',
            color:Colors.WHITE,
    }
})