import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Icon } from "react-native-elements"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Platos(props){
    const { navigation } = props
    const [ user, setUser ] = useState(null)
    const urlInfo = 'http://192.168.0.7:8000/api/info-user'
    useEffect(() => {
        ((async = () => {
            getData()
        }))()
    },[])
    // A subir el plato con su imagen usando image manupulator
    let getData = async () => {
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        const token = await AsyncStorage.getItem('token')
        
        await fetch(urlInfo, {
            method: 'POST',
            headers: { 'Content-type': 'application/json', 'X-CSRF-TOKEN': value},
            body: JSON.stringify({
                'token': token
            })
        })
        .then((response) => response.json())
        .then((responseJSON) => {
                if(responseJSON){
                    setUser(responseJSON)
                    console.log(responseJSON)
                }
        })
        .catch((error) => {
            AsyncStorage.removeItem('token')
            console.log(error)
        })
    }
    return(
        <View style={styles.viewBody} >
            <Text>Restaurant</Text>
            { user && (
                <Icon
                    reverse
                    type="material-community"
                    name="plus"
                    color="#00a680"
                    containerStyle={styles.btnContainer}
                    onPress={ () => navigation.navigate('add-platos') }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right:10,
        shadowColor: "black",
        shadowOffset: {
            width: 2, height: 2
        },
        shadowOpacity: 0.5
    }
})