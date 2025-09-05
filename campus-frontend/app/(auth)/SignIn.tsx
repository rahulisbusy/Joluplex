import Button from '@/components/Shared/Button';
import TextInputField from '@/components/Shared/TextInputField';
import { auth } from '@/configs/FireBaseConfig';
import axios from 'axios';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { Image } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
export default function SignIn() {
  const [email, setEmail] = useState<string|undefined>('');
  const [password, setPass] = useState<string|undefined>('');
  const [loading, setLoading] = useState<boolean|undefined>(false);
  const { user, setuser} = useContext(AuthContext);
 const onbtnPress = async () => {
  if (!email || !password) {
    ToastAndroid.show("Please enter all fields 🥺", ToastAndroid.BOTTOM);
    return;
  }
  try {
    setLoading(true);
    const resp = await signInWithEmailAndPassword(auth, email, password);
    
    if (resp.user) {
      console.log("Login response:", resp.user.email);

      try {
        const result = await axios.get(
          process.env.EXPO_PUBLIC_HOST + "/api/user?email=" + email,
          { timeout: 10000 }
        );
        console.log("User data from DB:", result.data);
        setuser(result.data);
      } catch (apiError: any) {
        console.error("API Error:", apiError.message);
        ToastAndroid.show("Could not fetch user data 🚨", ToastAndroid.BOTTOM);
      }
    }

    ToastAndroid.show("Signed in successfully!", ToastAndroid.BOTTOM);
    router.push("/(tabs)/Home");

  } catch (error: any) {
    console.error("Auth Error:", error.message);
    ToastAndroid.show(error.message, ToastAndroid.BOTTOM);
  } finally {
    setLoading(false);
  }
};


  return (
   <View style={styles.container}>
    <View style={styles.logoContainer}>
      <Image
        source={require("../../assets/images/buddies.jpg")}
        style={styles.logo}
      />
    </View>
    <Text style={styles.title}>Sign in to JoluPlex👋</Text>
    <View style={styles.formContainer}>
      <TextInputField
        label='Enter College Mail'
        placeholder='Mail Please...'
        onChange={setEmail}
      />
      <TextInputField
        label='Enter Your Password'
        placeholder='Password...'
        password={true}
        onChange={setPass}
      />
      <Button text='Sign In 🚀' onPress={onbtnPress} loading={loading} />
    </View>
  </View>
);

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    height: 250,
    width: 250,
    borderRadius: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  formContainer: {
    gap: 18,
    marginTop: 0,
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});