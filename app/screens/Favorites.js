import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { View, Text } from "react-native";

export default function Favorites(){
    const urlGetfavorites = `${url}/get-favorites`

    useFocusEffect(
        useCallback(() => {
            getFavorites()
        }, [])
    )
    const getFavorites = async () => {
        const token = await AsyncStorage.getItem('token')
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        const formData = new FormData()
        formData.append('token', token)
        await fetch(urlGetfavorites, {
            method: 'POST',
            headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
            body: formData
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            console.log(responseJSON)
            responseJSON.favorite.forEach(element => {
                console.log(element)
            });
        })
    }
    return (
        <View>
            <Text>Favorites</Text>
        </View> 
    )
}