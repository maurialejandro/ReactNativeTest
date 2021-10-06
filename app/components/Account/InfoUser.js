import React, { useState } from "react"
import { StyleSheet, View, Text, Platform } from "react-native"
import { Avatar, Icon } from "react-native-elements"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ImageResizer from "react-native-image-resizer"
import * as ImageManipulator from 'expo-image-manipulator';

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
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            if(result.cancelled){
                toastRef.current.show("Has cerrado los permisos de la galeria")
            } else {
                //uploadImage(result.uri)
                //resizeImageResizer(result.uri)
                resizeImageManipulator(result.uri)
            }
        }
       
    }
    const resizeImageManipulator = async (uri) => {
        
        const file = await ImageManipulator.manipulateAsync(
            uri,
            [
                {resize : {width: 1640, height:1480}}
            ],
            {compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        )
        uploadImage(file.uri)
    }

    const resizeImageResizer = async (uri) => {
        ImageResizer.createResizedImage(uri, 640, 480, 'JPEG', 1, 0)
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log(error)
        })
    }


    const uploadImage = async (uri) => {
        try {
            let formData = new FormData()
            const response = await fetch(uri)
            const blob = await response.blob()
            const value = await AsyncStorage.getItem('@MySuperStore:666999')
            const token = await AsyncStorage.getItem("token")
            formData.append('token', token)
            formData.append("image", {
                file: blob,
                uri: Platform.OS === "ios" ? uri.replace('file://', '') : uri,
                type: blob.type,
                size: blob.size,
                name: blob._data.name
            });
    
            await fetch(urlAvatar, {
                method: 'POST',
                headers: {'X-CSRF-TOKEN': value, 'Content-Type' : 'multipart/form-data'},
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
    const upImage = async (image) => {
       
          
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