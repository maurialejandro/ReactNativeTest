import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Avatar, Icon } from "react-native-elements"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"

export default function InfoUser(props){
    const { 
        userInfo: { photoURL, name, email, exp },
        toastRef: {}
    } = props

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
         const resultPermissionCamera = resultPermission.permissions.mediaLibrary.status
        if(resultPermissionCamera == "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria para cambiar foto perfil")
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            if(result.cancelled){
                toastRef.current.show("Has cerrado los permisos de la galeria")
            } else {
                uploadImage(result.uri)
            }
        }
       
    }

    const uploadImage = async (uri) => {
        const response = await fetch(uri)
        const blob = await response.blob()
        // crear funcion async para subir foto perfil a api
        
    }

    return (
        <View style={styles.viewUserInfo} >
            <Avatar 
                rounded
                size="large"
                containerStyle={styles.userInfoAvatar}
                source={ photoURL ? { uri: photoURL } : require("../../../assets/img/avatar2.png") }
            >
            <Avatar.Accessory 
                showEditButton
                onPress={() => changeAvatar()}
            />
            </Avatar>
            <View>
                <Text> {email} </Text>
                <Text> {name} </Text>
                <Text> {exp} </Text>
            </View>
        </View>
    )
    
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30    
    },
    userInfoAvatar: {
        marginRight:20,
        backgroundColor: "#C2751A"
    }
})