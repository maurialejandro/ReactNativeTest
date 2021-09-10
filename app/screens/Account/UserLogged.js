import React, {useState, useRef, useEffect} from "react";
import { StyleSheet, View, Text, AppRegistry } from "react-native";
import { Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast"
import Loading from "../../components/Loading"
import InfoUser from "../../components/Account/InfoUser"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserLogged(){
    const toastRef = useRef()
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const navigation = useNavigation()


    useEffect(() => {
        (async = () => { // funcion anonima autoejecutable
            //const user = await api.auth().traerUser
            console.log("traer al user y mejorar peticiones")
            
        })()
    })

    let logout = async () => {
        try{
            await AsyncStorage.removeItem('token')
            navigation.navigate('account')
        }catch (error) {
            console.log(error)
        }
    }
    return(
        <View style={styles.viewUserInfo}>
            {userInfo && <InfoUser userInfo={userInfo} />} 
            <Text>AccountOptioms</Text>
            <Button 
                title="Cerrar sesión" 
                onPress={() => logout()} 
                buttonStyle={styles.btnCloseSession} 
                titleStyle={styles.btnCloseSessionText}
            />
            <Toast ref={toastRef} posistion="center" opacity={0,9} />
            <Loading text={loadingText} isVisible={loading} />
        </View>
    )
}
const styles = StyleSheet.create({
    viewUserInfo: {
        
        minHeight: "100%",
        backgroundColor: "#f2f2f2"
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10
    },
    btnCloseSessionText: {
        color: "#00a680"
    }
})