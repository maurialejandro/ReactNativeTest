import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Input, Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"
import { size } from "lodash"

export default function ChangeDisplayPassword(props){
    const { setShowModal, toastRef } = props
    const [error, setError] = useState({})
    const urlUpdateProfilePass = 'http://192.168.0.7:8000/api/update-profile-pass'
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const [ form, setForm ] = useState(defaultValues())
    const [ showPassword, setShowPassword ] = useState(false)

    const onSubmit = async () => {
        let isSetError = true
        setError({})
        let errorsTemp = {}

        if(!form.newPass || !form.pass || !form.repeatNewPass){
            errorsTemp = {
                pass: !form.pass ? "La contraseña no puede estar vacia" : "",
                newPass: !form.newPass ? "La contraseña no puede estar vacia": "",
                repeatNewPass: !form.repeatNewPass? "La contraseña no puede estar vacia": ""
            }
        } else if (form.newPass !== form.repeatNewPass){
            errorsTemp = {
                newPass : "Las conteaseñas no son iguales",
                repeatNewPass: "Las contraseñas no son iguales"
            }
        }else if(size(form.newPass) < 6){
            errorsTemp={
                newPass: "La contraseña debe tener mas de 6 caracteres",
                repeatNewPass: "La contraseña debe tener mas de 6 caracteres"
            }
        }else{    
            setIsLoading(true)
            const value = await AsyncStorage.getItem('@MySuperStore:666999')
            const token = await AsyncStorage.getItem('token')
            const formData = new FormData()
            formData.append('token', token)
            formData.append('pass', form.newPass)
            formData.append('passOld', form.pass)
            fetch(urlUpdateProfilePass, {
                method: 'POST',
                headers: { 'Content-Type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
                body: formData
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                if(responseJSON.status === 'success'){
                    isSetError = false
                    setIsLoading(false)
                    setShowModal(false)
                    AsyncStorage.removeItem('token')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'account' }]
                    })
                }else if (responseJSON.message === "Ingresar contraseña correcta"){
                    errorsTemp={
                        pass: "Ingresar contraseña correcta",
                    }
                }else{
                    isSetError && setError("Error al altualizar contraseña")
                    isSetError && setIsLoading(false)
                }
                isSetError && setError(errorsTemp)
            })
            .catch((error) => {
                console.log(error)
                isSetError && setError("Error al actualizar contraseña")
                isSetError && setIsLoading(false)
            })
        }
        isSetError && setError(errorsTemp)
    }

    const onChange = (e, type) => {
        setForm({...form, [type]: e.nativeEvent.text})
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
                rightIcon={{
                    type: "material-community",
                    name:  showPassword ? "eye-off-outline" : "eye-outline" ,
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                password={true}
                secureTextEntry={showPassword ? true : false}
                onChange={ e => onChange(e, "pass") }
                errorMessage={error.pass}
            />
            <Input 
                placeholder="Nueva contraseña"
                containerStyles={styles.input}
                leftIcon={{
                    type:"material-community",
                    name:"lock-reset",
                    color: "#c2c2c2"                    
                }}
                rightIcon={{
                    type: "material-community",
                    name:  showPassword ? "eye-off-outline" : "eye-outline" ,
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                password={true}
                secureTextEntry={showPassword ? true : false}
                onChange={ e => onChange(e, "newPass") }
                errorMessage={error.newPass}
            />

            <Input 
                placeholder="Repetir nueva contraseña"
                containerStyles={styles.input}
                leftIcon={{
                    type:"material-community",
                    name:"lock-reset",
                    color: "#c2c2c2"                    
                }}
                rightIcon={{
                    type: "material-community",
                    name:  showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                password={true}
                secureTextEntry={showPassword ? true : false}
                onChange={ e => onChange(e, "repeatNewPass") }
                errorMessage={error.repeatNewPass}
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
function defaultValues(){
    return{
        pass: "",
        newPass: "",
        repeatNewPass: ""
    }
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