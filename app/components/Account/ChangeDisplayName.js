import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Input, Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"

export default function ChangeDisplayName(props){
    const { displayName, setShowModal, toastRef } = props
    const [ newDisplayName, setNewDisplayName ] = useState(null)
    const [error, setError] = useState(null)
    const urlUpdateProfile = 'http://192.168.0.7:8000/api/update-profile-name'
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()

    const onSubmit = async () => {
        setError(null)
        if(!newDisplayName){
            setError("El Nombre no puede estar vacio")
        } else if(displayName === newDisplayName){
            setError("El Nombre no puede ser el mismo")
        } else {
            setIsLoading(true)
            const value = await AsyncStorage.getItem('@MySuperStore:666999')
            const token = await AsyncStorage.getItem('token')
            const formData = new FormData()
            formData.append('token', token)
            formData.append('name', newDisplayName)
            fetch(urlUpdateProfile, {
                method: 'POST',
                headers: { 'Content-Type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
                body: formData
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                if(responseJSON.status === "success"){
                    setIsLoading(false)
                    setShowModal(false)
                    toastRef.current.show(responseJSON.message)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'account' }]
                    })
                }else{
                    setIsLoading(false)
                    toastRef.current.show(responseJSON.message)
                }
            })
            .catch((error) => {
                console.log(error)
                setError("Error al actualizar el nombre")
                setIsLoading(false)
            })
        }
    }
    return (
        <View>
            <Input 
                placeholder="Nombre y Apellidos"
                containerStyles={styles.input}
                leftIcon={{
                    type:"material-community",
                    name:"account-circle-outline",
                    color: "#c2c2c2"                    
                }}
                defaultValue={displayName || ""}
                onChange={ e => setNewDisplayName(e.nativeEvent.text) }
                errorMessage={error}
            />
            <Button 
                title="Cambiar Nombre"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        marginBottom: 10
    },
    view: {
        alignItems: "center",
        paddingBottom: 10,
        paddingTop: 10
    },
    btnContainer: {
        marginTop: 10,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
})