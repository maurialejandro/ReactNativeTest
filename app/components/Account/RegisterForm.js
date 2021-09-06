import React, {useState, useEffect} from "react"
import { View, Text, StyleSheet } from "react-native"
import { Icon, Input, Button } from "react-native-elements"
import { isEmpty, size } from "lodash"
import { validateEmail } from "../../screens/utils/validation"
//import { registerUser } from "../../screens/utils/register"
//import { getToken } from "../../screens/utils/token"

export default function RegisterForm(props){
    const [token, setToken] = useState(null)
    const [response, setResponse] = useState(null)
    const {toastRef} = props    
    const [showPassword,setShowPassword] = useState(false)
    const [showPassword2,setShowPassword2] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
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
            setResponse(responseJSON);
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
                registerUser(token.token)
                if(response){
                    if(response.code === 400){
                        toastRef.current.show(response.message)
                    }else if(response.code === 200){
                        toastRef.current.show("User creado satisfactoriamente")
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