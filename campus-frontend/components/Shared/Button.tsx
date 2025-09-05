import Colors from '@/data/Colors'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'

type Buttonprops = {
    text: string,
    onPress: () => void,
    loading?: boolean

}
export default function Button({ text, onPress,loading=false }: Buttonprops) {
    return (
        <TouchableOpacity
            onPress={
                onPress
            }
            style={{
                padding: 20,
                backgroundColor: Colors.PRIMARY,
                marginTop: 20,
                borderRadius: 15,

            }}
        >
            {loading ? <ActivityIndicator size="large" color="#ffffff" /> :
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: 'semibold',
                    textAlign: 'center',
                    color:Colors.WHITE
                }}
            >{text}</Text>}
        </TouchableOpacity>
    )
}