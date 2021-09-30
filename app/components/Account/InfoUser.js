import React, { useState } from "react"
import { StyleSheet, View, Text, Platform } from "react-native"
import { Avatar, Icon } from "react-native-elements"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function InfoUser(props){
    const { 
        userInfo: { photoURL, name, email, exp },
        toastRef
    } = props
    const urlAvatar = "http://192.168.1.5:8000/api/store-avatar"
    
    const [image, setImage] = useState(null)
    const [file, setFile] = useState(null)

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
    
    const getMimeType = (ext) => {
        // mime type mapping for few of the sample file types
        switch (ext) {
            case 'pdf': return 'application/pdf';
            case 'jpg': return 'image/jpeg';
            case 'jpeg': return 'image/jpeg';
            case 'png': return 'image/png';
        }
    }

    const uploadImage = async (uri) => {
        try {

            let formData = new FormData()
            const result = await fetch(uri)
            const blob = await result.blob()
            const value = await AsyncStorage.getItem('@MySuperStore:666999')
            const token = await AsyncStorage.getItem("token")
            formData.append('img', blob)
            formData.append('token', token)
            await fetch(urlAvatar, {
                method: 'POST',
                headers: {'X-CSRF-TOKEN': value},
                body: formData
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                console.log(responseJSON)
            })
                    
        } catch (error) {
            console.log(error)        
        }

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
                style={styles.accessoryStyle}
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
    accessoryStyle: {
        width: 25,
        height: 25
    },
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