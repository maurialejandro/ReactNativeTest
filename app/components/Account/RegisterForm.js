import React, {useState, useEffect} from "react"
import { View, Text, StyleSheet } from "react-native"
import Loading from "../Loading"
import { Icon, Input, Button } from "react-native-elements"
import { isEmpty, size } from "lodash"
import { validateEmail } from "../../screens/utils/validation"
import { useNavigation } from "@react-navigation/native"


export default function RegisterForm(props){
    const [token, setToken] = useState(null)
    const [response, setResponse] = useState(null)
    const {toastRef} = props    
    const [showPassword,setShowPassword] = useState(false)
    const [showPassword2,setShowPassword2] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    // Probar con que tal funciona con funciones
    const getToken = () => {
        fetch('http://192.168.1.5:8000/api/token')
        .then((response) => response.json())
        .then(data => {
            setToken(data)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const registerUser = (tok) => {
        setLoading(true)
        fetch('http://192.168.1.5:8000/api/register',{
            method: 'POST',
            headers: {'X-CSRF-TOKEN': tok},
            body: JSON.stringify({
                name: formData.email,
                email: formData.email,
                password: formData.password
            })
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            if(setResponse(responseJSON)){
                if(responseJSON.status === "success"){
                
                }else if(responseJSON.message === "User ya existe"){
                    toastRef.current.show(responseJSON.message)
                }
            }
           
        })
        .catch((error) => {
            console.log(error)
        })
    }
    const onSubmit = () => {
       
        if ( isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword) ||  (!validateEmail(formData.email)) || (formData.password != formData.repeatPassword) || (size(formData.password)<=6)  ){
            toastRef.current.show("Contraseña o correo incorrectos")
        } else {
            getToken()
            if(token){
                if(registerUser(token.token)){
                    if(response.code === 400){
                        console.log(response)
                        setLoading(false)
                        navigation.navigate('account')
                    }
                    if(response.code === 200){
                        setLoading(false)
                        console.log(response.status)
                    }
                }
            }
          
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