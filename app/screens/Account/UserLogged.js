import React, {useState, useRef} from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements"
import Toast from "react-native-easy-toast"
import Loading from "../../components/Loading"

export default function UserLogged(){
    const toastRef = useRef()
    const [loading, setLoadin] = useState(false)
    const [loadingText, setLoadingText] = useState("")
 
    return(
        <View style={styles.viewUserInfo}>
            <Text>InfoUser...</Text>
            <Text>AccountOptioms</Text>
            <Button 
                title="Cerrar sesión" 
                onPress={() => console.log("acción logout")} 
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