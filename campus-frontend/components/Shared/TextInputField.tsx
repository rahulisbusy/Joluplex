import Colors from '@/data/Colors'
import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

type Props = {
    label:string
    placeholder:string,
    password?:boolean,
    onChange:(text:string)=>void
}
export default function TextInputField({label,placeholder,onChange,password=false}:Props) {
  return (
    <View style={{marginTop:20}}>
      <Text style={{textAlign:'center',fontSize:18,color:Colors.GRAY}}>{label}</Text>
      <TextInput placeholder={placeholder} style={styles.textInput} secureTextEntry={password} onChangeText={onChange}/>
      
    </View>
  )
}
const styles = StyleSheet.create({textInput:{
  padding:10,
  borderWidth:0.3,
  fontSize:15,
  borderRadius:5,
  marginTop:5,
  width: 300


}})