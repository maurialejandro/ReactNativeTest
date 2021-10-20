import React,{useState} from 'react'
import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import * as ImageManipulator from 'expo-image-manipulator'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function AddPlatoForm(props){
    
    const { toastRef, setIsLoading, navigation } = props
    const [plato, setPlato] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const urlStorePlato = 'http://192.168.0.7:8000/api/store-platos'
    const addPlato = async () => {
        // Agregar validaciones 

        console.log(plato, price, description)
        const token = await AsyncStorage.getItem('token')
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        const formData = new FormData()
        formData.append('name', plato)
        formData.append('price', price)
        formData.append('description', description)
        formData.append('token', token)
        
        fetch( urlStorePlato ,{
            method: 'POST',
            headers: {'Content-type' : 'application/form-data', 'X-CSRF-TOKEN' : value},
            body: formData
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            console.log(responseJSON)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return(
        <ScrollView style={styles.scrollView} >
            <FormAdd setPlato={setPlato} setPrice={setPrice} setDescription={setDescription} />
            <UploadImage toastRef={toastRef} />
            <Button 
                title="Crear plato"
                onPress={addPlato}
                buttonStyle={styles.btnAdd}
            />
        </ScrollView>
    )
}

function FormAdd(props){
    const {setPlato, setPrice, setDescription} = props
    
    return(
        <View style={styles.viewForm}>
            <Input 
                placeholder="Nombre del plato"
                containerStyle={styles.input}
                onChange={ (e) => setPlato(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Precio"
                containerStyle={styles.input}
                onChange={ (e) => setPrice(e.nativeEvent.text)}
            /> 
            <Input 
                placeholder="Descripcion del plato"
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={ (e) => setDescription(e.nativeEvent.text)}
            /> 
        </View>
    )
}

function UploadImage(props){
    const { toastRef } = props
    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        )
        // Consultar donde estan todos los datos modificables de la app
        // saber de la base como funciona los sistemas informaticos y todo lo que se base en eso
        
        if(resultPermissions === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de galeria", 3000)
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            if(result.cancelled){
                toastRef.current.show("Has cerrado la galeria sin seleccionar ninguna imagen", 2000)
            }else{
                //console.log(result.uri)
                resizeImageManipulator(result)
            }
        }
    }

    const resizeImageManipulator = async (uri) => {
        console.log(uri)
        //const file = ImageManipulator.manipulateAsync(
        //    uri,
        //    [
        //        {resizer: {width: 1440, height: 1320}}
        //    ],
        //    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        //)


    }
    return(
        <View style={styles.viewImage}>
            <Icon 
                type="material-community"
                name="camera"
                color="#7a7a7a"
                containerStyle={styles.containerIcon}
                onPress={imageSelect}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    scrollView:{
        height: "100%",
    },
    viewForm:{
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnAdd: {
        backgroundColor: "#00a680",
        margin: 20
    },
    viewImage:{
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },  
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    }
})