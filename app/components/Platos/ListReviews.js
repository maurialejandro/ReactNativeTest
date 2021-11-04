import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Button, Avatar, Rating } from "react-native-elements"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function ListReview(props){
    const { navigation, plato } = props
    const [ logged, setLogged ] = useState(false)

    useEffect(() => {
        userLoged()
    }, [])
    
    const userLoged = async () => {
        const token = await AsyncStorage.getItem('token')
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        const urlLogin = `${url}/check-user`
        const formData = new FormData()
        formData.append('token', token)
        await fetch(urlLogin, {
            method: 'POST',
            headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
            body: formData
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            if(responseJSON.user){
                setLogged(true)
            }else if(responseJSON.code ===  402){
                alert("usuario no logueado")
                setLogged(false)
                AsyncStorage.removeItem('token')
            }
        })
        .catch((error) => {
            setLogged(false)
            console.log(error)
            AsyncStorage.removeItem('token')
        })
    }
    
    return(
        <View>
            {logged ? (
                <Button 
                    title="Escribe una opinión"
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnTitleAddReview}
                    onPress={() => navigation.navigate("add-review-plato",{
                        plato: plato
                    })}
                    icon={{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "orange"
                    }}
                />
            ) : (
                <View>
                    <Text
                        style={{ textAlign: "center", color: "black", padding: 20}}
                        onPress={() => navigation.navigate("login")} 
                    >Para puntuar o escribir comentarios hay que estar logueado</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent",      
    },
    btnTitleAddReview: {
        color: "orange"
    }
})