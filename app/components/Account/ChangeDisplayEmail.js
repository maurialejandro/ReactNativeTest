import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Input, Button } from "react-native-elements"
import { validateEmail } from "../../screens/utils/validation"
import { useNavigation } from "@react-navigation/native"

export default function ChangeDisplayEmail(props){
    const { displayEmail, setShowModal, toastRef } = props
    const [ newDisplayEmail, setNewDisplayEmail ] = useState(null)
    const [ pass, setPass ] = useState(null)

    const [error, setError] = useState(null)
    const [errorPass, setErrorPass] = useState(null)
    const urlUpdateProfileEmail = 'http://192.168.0.7:8000/api/update-profile-email'
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()

    const onSubmit = async () => {
        setErrorPass(null)
        setError(null)
        if(!newDisplayEmail){
            setError("Email no modificado")
        } else if(displayEmail === newDisplayEmail){
            setError("El Email no puede ser el mismo")
        } else if(!validateEmail(newDisplayEmail)){
            setError("Email incorrecto")
        } else if(!pass){    
            setErrorPass('Contraseña no puede estar vacia')   
        }else{
            setIsLoading(true)
            const value = await AsyncStorage.getItem('@MySuperStore:666999')
            const token = await AsyncStorage.getItem('token')
            const formData = new FormData()
            formData.append('token', token)
            formData.append('email', newDisplayEmail)
            formData.append('pass', pass)
            fetch(urlUpdateProfileEmail, {
                method: 'POST',
                headers: { 'Content-Type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
                body: formData
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                if(responseJSON.token){
                    setIsLoading(false)
                   
                    toastRef.current.show(responseJSON.message)
                    // elegi que el usuario haga sesion de nuevo
                    // pero se puede obetner el nuevo token con el nuevo email automaticamente para actualizar userInfo
                    AsyncStorage.removeItem('token')
                    _storeToken(responseJSON.token)
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'account' }]
                    })

                }else if(responseJSON.message === 'Error email ya registrado'){
                    setIsLoading(false)
                    setError("Email ya registrado")
                } else if(responseJSON.message === 'Error al obtene usuario'){
                    setIsLoading(false)
                    setErrorPass("Contraseña incorrecta")
                } else {
                    console.log(responseJSON)
                    setIsLoading(false)
                    setError("Error al altualizar Email")
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)  
                setError("Error al actualizar el Email")
            })
        }
    }
    let _storeToken = async (token) => {
        try{
            await AsyncStorage.setItem('token', token)
        }catch (error) {
            console.log(error)
        }
    }
    return (
        <View>
            <Input 
                placeholder="Nombre y Apellidos"
                containerStyles={styles.input}
                leftIcon={{
                    type:"material-community",
                    name:"email",
                    color: "#c2c2c2"                    
                }}
                defaultValue={displayEmail || ""}
                onChange={ e => setNewDisplayEmail(e.nativeEvent.text) }
                errorMessage={error}
            />
            <Input 
                placeholder="Contraseña"
                containerStyles={styles.input}
                leftIcon={{
                    type:"material-community",
                    name:"key",
                    color: "#c2c2c2"                    
                }}
                defaultValue={""}
                onChange={ e => setPass(e.nativeEvent.text) }
                errorMessage={errorPass}
            />
            <Button 
                title="Cambiar Email"
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