import React, {useState, useEffect} from "react"
import { View, Text, StyleSheet } from "react-native"
import { Icon, Input, Button } from "react-native-elements"
import { isEmpty, size } from "lodash"
import { validateEmail } from "../../screens/utils/validation"
import { registerUser } from "../../screens/utils/register"

export default function RegisterForm(props){
    
    const {toastRef} = props    
    const [showPassword,setShowPassword] = useState(false)
    const [showPassword2,setShowPassword2] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
  
    const onSubmit = () => {
  
        if ( isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword) ||  (!validateEmail(formData.email)) || (formData.password != formData.repeatPassword) || (size(formData.password)<=6)  ){
            toastRef.current.show("Contraseña o correo incorrectos")
        } else {
            console.log("guardar datos en api")
            registerUser(formData)
            
        }
    }
    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text}   )
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