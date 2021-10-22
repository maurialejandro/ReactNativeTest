import React, { useState } from 'react'
import { StyleSheet, View, Alert, Text, ScrollView, Dimensions } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import { size, filter } from "lodash"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import * as ImageManipulator from 'expo-image-manipulator'
import Modal from "../../components/Account/Modal"

const widthScreen = Dimensions.get("window").width

export default function AddPlatoForm(props){
    
    const { toastRef, setIsLoading, navigation } = props
    const [plato, setPlato] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState([])
    const urlStorePlato = 'http://192.168.0.7:8000/api/store-platos'
    const [isVisibleMap, setIsVisibleMap] = useState(false)
  
    const addPlato = async () => {
        if(plato === "" ||  price === "" || description === "" || files === "" || !files){
            toastRef.current.show("¿Falto agregar algun campo?")
        }else{
            const token = await AsyncStorage.getItem('token')
            const value = await AsyncStorage.getItem('@MySuperStore:666999')
            const response = await fetch(files)
            const blob = await response.blob()
            const formData = new FormData()
            formData.append('name', plato)
            formData.append('price', price)
            formData.append('description', description)
            formData.append('token', token)
            formData.append('image',{
                file: blob,
                uri: Platform.OS === "ios" ? files.replace('file://', '') : files,
                type: blob.type,
                size: blob.size,
                name: blob._data.name
            })
            fetch( urlStorePlato ,{
                method: 'POST',
                headers: {'Content-type' : 'application/form-data', 'X-CSRF-TOKEN' : value},
                body: formData
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                console.log(JSON.stringify(responseJSON))
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    return(
        <ScrollView style={styles.scrollView} >
            <ImageRestaurant 
                image={files[0]}
            />
            <FormAdd setPlato={setPlato} setIsVisibleMap={setIsVisibleMap} setPrice={setPrice} setDescription={setDescription} />
            <UploadImage setFiles={setFiles} files={files} toastRef={toastRef} />
            <Button 
                title="Crear plato"
                onPress={addPlato}
                buttonStyle={styles.btnAdd}
            />
            <Map isVisibleMap={isVisibleMap} setIsVisibleMap={setIsVisibleMap} />
        </ScrollView>
    )
}

function ImageRestaurant(props){
    const { image } = props
    return(
        <View>
            <Image
                source={image ? {uri: image } : require('../../../assets/img/default-image.png')}
                style={{ width: widthScreen, height: 200 }}
            />
        </View>
    )
}

function Map(props){
    const {isVisibleMap, setIsVisibleMap} = props
    console.log(isVisibleMap)
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <Text>Mapa</Text>
        </Modal>
    )
}
function FormAdd(props){
    const {setPlato, setPrice, setDescription, setIsVisibleMap} = props
    
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
                rightIcon={
                    <Icon 
                        type="material-community"
                        name="google-maps"
                        onPress={() => setIsVisibleMap(true)}
                    />
                    
                }
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
    const { toastRef, files, setFiles } = props
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
                const file = await ImageManipulator.manipulateAsync(
                    result.uri,
                    [
                        {resize : {width: result.width * 0.5, height: result.height * 0.5}}
                    ],
                    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
                )
                 
                setFiles([...files, file.uri])
            }
        }
    }

    const removeImage = (image) => {
        
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres eliminar imagen?",
            [
                {
                    text: "Calncelar",
                    onPress: () => console.log("cancel"), 
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        setFiles(
                            filter(files, (imageUrl) => imageUrl !== image)
                       )
                    }
                }
            ],
            {cancelable: false}
        )
    }
    return(
        <View style={styles.viewImage}>
            {size(files) < 5 &&  (
                <Icon 
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {files.map((file, index) => (
                <Avatar 
                    key={index}
                    source={{
                        uri:file
                    }}
                    containerStyle={{margin: 7}}
                    size="medium"
                    onPress={() => {
                        removeImage(file)
                    }}
                />  
            ))}
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
    },
    avatar: {
        margin: 2,
        padding: 2
    },
})