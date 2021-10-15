import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Input, Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"
export default function ChangeDisplayPassword(props){
    const { setShowModal, toastRef } = props
    const [ oldPass, setOldPass ] = useState(null)
    const [ newPass, setNewPass ] = useState(null)
    const [ resetNewPass, setResetNewPass ] = useState(null)
    const [error, setError] = useState(null)
    const urlUpdateProfilePass = 'http://192.168.0.7:8000/api/update-profile-pass'
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()

    const onSubmit = async () => {
        setError(null)
        if(!newPass && oldPass && resetNewPass){
            setError("El campo contraseña no puede estar vacio")
        } else if(newPass !== resetNewPass){
            setError('Las contraseñas deben ser iguales')
        }else{    
            setIsLoading(true)
            const value = await AsyncStorage.getItem('@MySuperStore:666999')
            const token = await AsyncStorage.getItem('token')
            const formData = new FormData()
            formData.append('token', token)
            formData.append('pass', newPass)
            formData.append('passOld', oldPass)
            fetch(urlUpdateProfilePass, {
                method: 'POST',
                headers: { 'Content-Type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
                body: formData
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                setShowModal(false)
                if(responseJSON.status === 'success'){
                    setIsLoading(false)
                    AsyncStorage.removeItem('token')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'account' }]
                    })
                }else{
                    setError("Error al altualizar contraseña")
                    setIsLoading(false)
                }
            })
            .catch((error) => {
                console.log(error)
                setError("Error al actualizar contraseña")
                setIsLoading(false)
            })
        }
    }
    return (
        <View>
            <Input 
                placeholder="Contraseña actual"
                containerStyles={styles.input}
                leftIcon={{
                    type:"material-community",
                    name:"key",
                    color: "#c2c2c2"                    
                }}
                onChange={ e => setOldPass(e.nativeEvent.text) }
                errorMessage={error}
            />
            <Input 
                placeholder="Nueva contraseña"
                containerStyles={styles.input}
                leftIcon={{
                    type:"material-community",
                    name:"lock-reset",
                    color: "#c2c2c2"                    
                }}
                onChange={ e => setNewPass(e.nativeEvent.text) }
                errorMessage={error}
            />

            <Input 
                placeholder="Repetir nueva contraseña"
                containerStyles={styles.input}
                leftIcon={{
                    type:"material-community",
                    name:"lock-reset",
                    color: "#c2c2c2"                    
                }}
                onChange={ e => setResetNewPass(e.nativeEvent.text) }
                errorMessage={error}
            />

            <Button 
                title="Cambiar Contraseña"
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