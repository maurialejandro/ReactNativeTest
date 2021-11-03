import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text, Platform } from "react-native"
import { Avatar } from "react-native-elements"
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImageManipulator from 'expo-image-manipulator'

export default function InfoUser(props){
    const { 
        userInfo: { avatar, name, email, exp},
        toastRef,
        setLoading,
        setLoadingText
    } = props

    const [photoURL, setPhotoURL] = useState(null)
    const urlAvatar = `${url}/store-avatar`
    useEffect(()=>{
        if(avatar){
            setPhotoURL(`${url}/get-avatar/${avatar}`)
        }
    },[])
    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        const resultPermissionCamera = resultPermission.permissions.mediaLibrary.status
        if(resultPermissionCamera == "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria para cambiar foto perfil")
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            })
            if(result.cancelled){
                toastRef.current.show("Has cerrado los permisos de la galeria")
            }else{
                resizeImageManipulator(result)
            }
        }
    }

    const resizeImageManipulator = async (result) => {

        const file = await ImageManipulator.manipulateAsync(
            result.uri,
            [
                {resize : {width: result.width * 0.5 , height: result.height * 0.5}}
            ],
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        )
        uploadImage(file.uri)
    }

    const uploadImage = async (uri) => {
        
        setLoadingText("Subiendo imagen")
        setLoading(true)
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
        })
        await fetch(urlAvatar, {
            method: 'POST',
            headers: {'X-CSRF-TOKEN': value, 'Content-Type' : 'multipart/form-data'},
            body: formData
        })
        .then((response) => response.json())
        .then(async (responseJSON) => {
            if(responseJSON.status === "success"){
                await setPhotoURL(`${url}/get-avatar/${responseJSON.avatar}`)
                toastRef.current.show('Imagen subida satisfactoriamente') 
            }
            setLoading(false)
        })
        .catch((error) => {
            console.log(error)
            AsyncStorage.removeItem('token')
            setLoading(false)
        })
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