import Button from '@/components/Shared/Button';
import TextInputField from '@/components/Shared/TextInputField';
import { auth } from '@/configs/FireBaseConfig';
import Colors from '@/data/Colors';
import Entypo from '@expo/vector-icons/Entypo';
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export default function SignUp() {
    const [image, setImage] = useState<string>('');
    const [name, setName] = useState<string | undefined>('');
    const [email, setEmail] = useState<string | undefined>('');
    const [password, setPass] = useState<string | undefined>('');
    const { user, setuser} = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean|undefined>(false);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });


        if (!result.canceled) {
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
   const onbtnPress = async () => {
    if (!email?.trim() || !password?.trim() || !name?.trim()) {
        ToastAndroid.show("Please enter all fields 🥺", ToastAndroid.BOTTOM);
        return;
    }
    try {
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('user', user);
        const upload={
                name: name,
                email: user.email,
                
                image: await uploadImage(image) // This is a local URI; consider uploading to cloud storage
            }
            console.log(upload);
        
             const result = await axios.post(
            process.env.EXPO_PUBLIC_HOST+'/api/user',upload
            
        );

        
       
        console.log("Saved in DB");
        setuser(upload);
        setLoading(false);
        router.push('/(auth)/SignIn');
    } catch (err) {
        console.error(err);
        ToastAndroid.show("Sign up failed", ToastAndroid.BOTTOM);
    }
    setLoading(false);
}
    return (
        <View
            style={{
                padding: 40,
                paddingTop: 60
            }}
        >
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}
            >Be a Jolite ✨</Text>
            <View style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10
            }}>
                <View >
                    <TouchableOpacity onPress={() => pickImage()}>


                        {image ? <Image
                            source={{ uri: image }} style={styles.profileImage}
                        />


                            :
                            <Image source={require("../../assets/images/profile.png")}
                                style={styles.profileImage}
                            />}



                        <Entypo name="camera" size={24} color={Colors.PRIMARY}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 30 }}>

                    <TextInputField label='Enter Your Name' placeholder='Name Please...' onChange={(v) => setName(v)} />
                    <TextInputField label='Enter College Mail' placeholder='Mail Please...' onChange={(v) => setEmail(v)} />
                    <TextInputField label='Enter Your Password' placeholder='Password...' password={true} onChange={(v) => setPass(v)} />
                    <Button text='Get set go 🔥' onPress={() => onbtnPress()} loading={loading} />
                </View>


            </View>


        </View>
    )
}
const styles = StyleSheet.create({
    profileImage: {
        height: 120,
        width: 120,
        borderRadius: 100,
        marginTop: 30,
    }
})