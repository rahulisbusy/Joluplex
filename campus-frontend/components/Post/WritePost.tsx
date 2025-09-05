import { View, Text, TextInput, TouchableOpacity, ToastAndroid} from 'react-native'
import Button from '@/components/Shared/Button'
import React, { useContext, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Colors from '@/data/Colors'
import { Image } from 'react-native'
import { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import * as ImagePicker from 'expo-image-picker';
import { cld } from '@/configs/CloudinaryConfig'
import {upload} from 'cloudinary-react-native'
import { options } from '@/configs/CloudinaryConfig';
import axios from 'axios'
import { AuthContext } from '@/context/AuthContext'
import { router } from 'expo-router'
export default function WritePost() {
  const [value, setValue] = useState(null);
  const [isopen, setIsopen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const {user}=useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [content, setcontent] = useState<string|null>();
  const [items, setitems] = useState([
  {label:'Public', value:'0'}
  ])
  useEffect(()=>{
    user && getUserFollowedClub();
  },[user])
  const getUserFollowedClub = async () => {
  const result = await axios.get(
    process.env.EXPO_PUBLIC_HOST + "/api/followclub?u_email=" + user?.email
  );

  const data = result.data.data.map((item: any) => ({
    label: item?.name,
    value: item?.club_id,
  }));

  setitems([{ label: 'Public', value: '0' }, ...data]); // reset fresh
};

  const pickImage = async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [4, 4],
              quality: 1,
          });
         
  
  
          if (!result.canceled) {
            console.log('image',result.assets[0].uri)
              setImage(result.assets[0].uri);
          }
           
      };

      const uploadImage = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg", // or png
      name: "upload.jpg",
    } as any);
    formData.append("upload_preset", "joluplex"); // your unsigned preset

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log('data',data)
    console.log("Uploaded to Cloudinary:", data.secure_url);
    return data.secure_url;
  } catch (err) {
    console.error("Upload error:", err);
    return null;
  }
};

 const postbuttonclick = async () => {
  setLoading(true);
  try {
    if (!content) {
      ToastAndroid.show("At least say something!🫠", ToastAndroid.SHORT);
      return;
    }
    if (!value) {
      ToastAndroid.show("Please select a category!", ToastAndroid.SHORT);
      return;
    }
    
    let uploadimageurl = '';
if (image) {
  uploadimageurl = await uploadImage(image);
  if (!uploadimageurl) {
    ToastAndroid.show("Image upload failed!", ToastAndroid.SHORT);
    setLoading(false);
    return;
  }
}


    const result = await axios.post(
      process.env.EXPO_PUBLIC_HOST + '/api/post',
      {
        content: content,
        imageurl: uploadimageurl,
        visiblein: value,
        createdby: user?.email,
      }
    );
    console.log(result.data);
    ToastAndroid.show("Posted successfully!🎉", ToastAndroid.SHORT);
  } catch (err) {
    console.log("Post failed", err);
    ToastAndroid.show("Failed to post!😔", ToastAndroid.SHORT);
  }
  setLoading(false);
  router.replace('/(tabs)/Home');
};

  return (
    <View>
      <TextInput 
      placeholder='Share your jolu update...' style={styles.input} 
      multiline={true}
      numberOfLines={5}
      maxLength={1000}
        onChangeText={(v)=>setcontent(v)}
      />

      <TouchableOpacity onPress={pickImage}>
      {
        image ?<Image source={{uri:image}} style={styles.image}/>:
        <Image source={require('../../assets/images/image.png')} style={styles.image}/>
      }  
      
      </TouchableOpacity>

      <View
      style={{marginTop:20, marginBottom:20, gap:10}}
      >
        <DropDownPicker
      items={items}
      setItems={setitems}
      value={value}
        placeholder='Select Category'
        open={isopen}
        setOpen={setIsopen}
        setValue={setValue}
      
        style={{
            borderColor:Colors.WHITE,
            marginTop:15,
            borderRadius:8,
            elevation:7,
        }}
      />

      <Button text='Post' onPress={postbuttonclick} loading={loading} />

      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({
    input:{
        backgroundColor:Colors.WHITE,
        borderWidth:1,
        borderRadius:8,
        borderColor:Colors.WHITE,
        padding:10,
        marginTop:10,
        height:140,
        textAlignVertical:'top',
        elevation:7,
    },
    image:{
     height:100,
     width:100,
     borderRadius:8,
     marginTop:10,
    }

})