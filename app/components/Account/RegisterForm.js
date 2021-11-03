import React, {useState, useEffect, Component} from "react"
import { View, Text, StyleSheet } from "react-native"
import Loading from "../Loading"
import { Icon, Input, Button } from "react-native-elements"
import { isEmpty, size } from "lodash"
import { validateEmail } from "../../screens/utils/validation"
import { useNavigation, Link } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function RegisterForm(props){
    const {toastRef} = props    
    const [showPassword,setShowPassword] = useState(false)
    const [showPassword2,setShowPassword2] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const urlRegister = `${url}/register`

    let registerUser = async () => {
        try {
            setLoading(true)
            const value = await AsyncStorage.getItem('@MySuperStore:666999');
            await fetch(urlRegister, {
                method: 'POST',
                headers: { 'Content-type': 'application/json', 'X-CSRF-TOKEN': value},
                body: JSON.stringify({
                    name: formData.email,
                    email: formData.email,
                    password: formData.password
                })
            })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if(json.status === 'success' && json.message === 'User creado' ){
                    setLoading(false)
                    toastRef.current.show(json.message)
                    navigation.reset({
                        index: 0,
                        routes: { name: 'account' }
                    })
                }else if(json.status === 'error'){
                    setLoading(false)
                    toastRef.current.show(json.message)
                }
            })
            .catch((error) => console.log(error))
        } catch (error) {
            console.log(error)
        }
    }    

    const onSubmit = async () => {
       
        if ( isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword) ||  (!validateEmail(formData.email)) || (formData.password != formData.repeatPassword) || (size(formData.password)<=6)  ){
            toastRef.current.show("Contraseña o correo incorrectos")
        } else {
            registerUser()
        }  
    }
    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text})
    }   
    return(
        <View style={styles.formContainer}>
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
            <Input 
                placeholder="Repetir contraseña"
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={showPassword2 ? true : false}
                onChange={e => onChange(e, "repeatPassword")}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={showPassword2 ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword2(!showPassword2)}
                    />
                }
            />
            <Button 
                title="Registrar"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
            <Loading 
                isVisible={loading}
                text="Creando cuenta"
            />
        </View>
    )
}
function defaultFormValues(){
    return{
        email: "",
        password: "",
        repeatPassword: ""
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10
    },
    inputForm: {
        width: "100%"
    },
    btnContainerRegister: {
        marginTop: 20,
        width: "95%"
    },
    btnRegister: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1"
    }
})