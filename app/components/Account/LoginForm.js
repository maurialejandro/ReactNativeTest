import React, {useState} from "react"
import { StyleSheet, View } from "react-native"
import { isEmpty, size } from "lodash"
import { Input, Icon, Button } from "react-native-elements"
import { validateEmail } from "../../screens/utils/validation"

export default function LoginForm(props){
    const [showPassword,setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const {toastRef} = props 
    const [token, setToken] = useState(null)
    const [response, setResponse] = useState(null)
    
    function getToken() {
        fetch('http://192.168.1.5:8000/api/token')
        .then((response) => response.json())
        .then(data => {
            setToken(data)
            loginUser(data.token)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const loginUser = (tok) => {
        console.log(tok)
        fetch('http://192.168.1.5:8000/api/login',{
            method: 'POST',
            headers: {'X-CSRF-TOKEN': tok},      
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            console.log(responseJSON)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    const onSubmit = () => {
        if ( isEmpty(formData.email) || isEmpty(formData.password) ||  (!validateEmail(formData.email)) || (size(formData.password)<=6)  ){
            toastRef.current.show("Contraseña o correo incorrectos")
        } else { 
            getToken()
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