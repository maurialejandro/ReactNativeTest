import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import Loading from "../Loading"
import { isEmpty, size } from "lodash"
import { Input, Icon, Button } from "react-native-elements"
import { validateEmail } from "../../screens/utils/validation"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'


export default function LoginForm(props){
    const [showPassword,setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const {toastRef} = props 
    const urlLogin = 'http://192.168.0.7:8000/api/login'
    const navigation = useNavigation()
    
    let loginUser = async () => {
        try {
            setLoading(true)
            const value = await AsyncStorage.getItem('@MySuperStore:666999');
            await fetch(urlLogin, {
                method: 'POST',
                headers: {'X-CSRF-TOKEN': value},
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                setLoading(false)
                if(responseJSON.token){
                    _storeToken(responseJSON.token)
                    console.log('se hizo login satisfactoriamente')
                    navigation.navigate('account')
                }else{
                    toastRef.current.show("Contraseña o correo incorrectos")
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log(error)
            })
            
        } catch (error) {
            console.log(error)
        }
    }  
    
    
    let _storeToken = async (token) => {
        try{
            await AsyncStorage.setItem('token', token)
        }catch (error) {
            console.log(error)
        }
    }
    const onSubmit = () => {
        if ( isEmpty(formData.email) || isEmpty(formData.password) ||  (!validateEmail(formData.email)) || (size(formData.password)<=6)  ){
            toastRef.current.show("Contraseña o correo incorrectos")
        } else { 
            loginUser()
        }  
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text})
    }
    return (
        <View style={styles.formContainer} >
            <Input 
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "email")}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input 
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword ? true : false}
                onChange={e => onChange(e, "password")}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Button 
                title="Iniciar sesión"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />
            <Loading 
                isVisible={loading}
                text="Iniciando sesión"
            />
        </View>
    )
}

function defaultFormValues(){
    return{
        email: "",
        password: ""
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%"
    },
    btnLogin: {
        backgroundColor: "#00a680"
    },
    iconRight:{
        color: "#c1c1c1"
    }
})