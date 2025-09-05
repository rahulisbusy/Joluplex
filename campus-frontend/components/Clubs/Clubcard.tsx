import { View, Text, Image, StyleSheet, ToastAndroid } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Club } from '@/app/explore-clubs'
import Button from '../Shared/Button'
import Colors from '@/data/Colors' 
import { AuthContext } from '@/context/AuthContext'
import axios from 'axios'
import { useState } from 'react'
interface clubCardProps{
    club:Club,
    isFollowed:boolean
}
export default function Clubcard({club,isFollowed}:clubCardProps) {
  const {user}=useContext(AuthContext); 
  const [loading, setLoading] = useState<boolean>(false);
  const [followed, setFollowed] = useState<boolean>(isFollowed);
  
  useEffect(()=>{
   setFollowed(isFollowed);
  },[isFollowed])
 const toggleFollow = async () => {
    
  try {
    setLoading(true);

    const url = followed
      ? process.env.EXPO_PUBLIC_HOST + "/api/unfollowclub"
      : process.env.EXPO_PUBLIC_HOST + "/api/followclub";

    const result = await axios.post(url, {
      u_email: user?.email,
      club_id: club?.id,
    });

    // Update local state
     setFollowed(!followed);

    ToastAndroid.show(result.data.message, ToastAndroid.SHORT);
  } catch (err) {
    ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.card}>
      <Image source={{ uri: club.logo }} style={styles.logo} />
      <Text style={styles.name}>{club.name}</Text>
      <Text style={styles.about}>{club.about}</Text>
      <Button text={followed? "Unfollow" : "Follow" } onPress={toggleFollow} loading={loading}  />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.TERTIARY,
    width: "45%",
    borderRadius: 16,
    padding: 8,
    marginVertical: 2,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.GRAY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4, 
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: Colors.SECONDARY,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.SECONDARY,
    marginBottom: 2,
    textAlign: 'center',
  },
  about: {
    fontSize: 14,
    color: Colors.GRAY,
    marginBottom: 2,
    textAlign: 'center',
  },
})
