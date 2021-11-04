import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Alert, Text, ScrollView, Dimensions, Platform } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import { size, filter, isInteger } from "lodash"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Permissions from "expo-permissions"
import * as ImagePicker from "expo-image-picker"
import * as ImageManipulator from 'expo-image-manipulator'
import * as Location from "expo-location"
import MapView from 'react-native-maps'
import Modal from "../../components/Account/Modal"

const widthScreen = Dimensions.get("window").width

export default function AddPlatoForm(props){
    
    const { toastRef, setIsLoading, navigation } = props
    const [plato, setPlato] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState([])
    const urlStorePlato = `${url}/store-platos`
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationPlato, setLocationPlato] = useState(null)
    
    const addPlato = async () => {
        if( !plato || !price || !description ){
            toastRef.current.show("¿Falto agregar algun campo?")
        }else if(size(files) === 0){
            toastRef.current.show("El plato tiene que terner al menos una imagen")
        }else if(!locationPlato){
            toastRef.current.show("Debe localizar donde se encuentra el plato en el mapa")
        }else{    
            setIsLoading(true)
            updateImage().then(async (response) => {
                const token = await AsyncStorage.getItem('token')
                const value = await AsyncStorage.getItem('@MySuperStore:666999')
                const formData = new FormData()
                formData.append('name', plato)
                formData.append('price', price)
                formData.append('description', description)
                formData.append('latitude', locationPlato.latitude)
                formData.append('longitude', locationPlato.longitude)
                formData.append('latitudeDelta', locationPlato.latitudeDelta)
                formData.append('longitudeDelta', locationPlato.longitudeDelta)
                formData.append('token', token)
                formData.append('path', JSON.stringify(response))
                fetch(urlStorePlato ,{
                    method: 'POST',
                    headers: {'Content-type' : 'application/form-data', 'X-CSRF-TOKEN' : value},
                    body: formData
                })
                .then((response) => response.json())
                .then((responseJSON) => {
                    setIsLoading(false)
		            navigation.reset({
		            	index: 0,
			            routes: [{ name: 'platos' }]
		            })
                })
                .catch((error) => {
                    setIsLoading(false)
                    console.log(error)
                })
            })
        }
    }
    
    const updateImage = async () => {
        const urlStoreImage = `${url}/store-file-plato`
        const imageBlob = []
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        const token = await AsyncStorage.getItem('token')
        let formData = new FormData()
        await Promise.all(
            files.map(async (file, index) => {
                const response = await fetch(file)
                const blob = await response.blob()
                formData.append('token', token)
                formData.append('image', {
                    file: blob,
                    uri: Platform.OS === 'ios' ? file.replace('file://', ''): file,
                    type: blob.type,
                    size: blob.size,
                    name: blob._data.name   
                })
                await fetch(urlStoreImage, {
                    method: 'POST',
                    headers:{ 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
                    body: formData
                })
                .then((response) => response.json())
                .then((responseJSON) => {
                    imageBlob.push(responseJSON.path)
                })
                .catch((error) => {
                    console.log(error)
                })
            })
        )
        return imageBlob
    }
    return(
        <ScrollView style={styles.scrollView} >
            <ImageRestaurant 
                image={files[0]}
            />
            <FormAdd 
                setPlato={setPlato} 
                setIsVisibleMap={setIsVisibleMap} 
                setPrice={setPrice} 
                setDescription={setDescription} 
                locationPlato={locationPlato}
            />
            <UploadImage setFiles={setFiles} files={files} toastRef={toastRef} />
            <Button 
                title="Crear plato"
                onPress={addPlato}
                buttonStyle={styles.btnAdd}
            />
            <Map 
                isVisibleMap={isVisibleMap} 
                setIsVisibleMap={setIsVisibleMap} 
                setLocationPlato={setLocationPlato}
                toastRef={toastRef}
            />
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
    const {isVisibleMap, setIsVisibleMap, setLocationPlato, toastRef} = props
    const [location, setLocation] = useState(null)

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            )
            const statusPermissions = resultPermissions.permissions.location.status
            if(statusPermissions !== "granted"){
                toastRef.current.show("Tiene que aceptar los permisos de localizacion para crear un plato", 3000)
            }else{
                const loc = await Location.getCurrentPositionAsync({})
                
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001 
                })
            }
        })()
    },[])

    const confirmLocation = () => {
        setLocationPlato(location)
        toastRef.current.show("Localizacion guardada correctamente")
        setIsVisibleMap(false)
    }
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView 
                        style={styles.mapStyle} 
                        initialRegion={location} 
                        showsUserLocation={true} 
                        onRegionChange={
                            (region) => setLocation(region)
                        } 
                    >
                        <MapView.Marker 
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button 
                        title="Guardar Ubicacion"
                        onPress={() => console.log("GUARDAR")}
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={ () => confirmLocation() }
                    />
                    <Button 
                        title="Cancelar"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={ () => setIsVisibleMap(false) }
                    />
                </View>    
            </View>
        </Modal>
    )
}
function FormAdd(props){
    const {
        setPlato,
        setPrice, 
        setDescription, 
        setIsVisibleMap,
        locationPlato
    } = props
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
                keyboardType="numeric"
                onChange={ (e) => setPrice(e.nativeEvent.text)}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name="google-maps"
                        color={locationPlato ? "#000000" : "#c2c2c2"}
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
        backgroundColor: "orange",
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
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680"
    }
})
