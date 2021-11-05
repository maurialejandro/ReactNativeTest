import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import Loading from "../components/Loading"
import { size } from "lodash"
import { Icon } from "react-native-elements"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Favorites(){
    const navigation = useNavigation()
    const urlGetfavorites = `${url}/get-favorites`
    const [ platos, setPlatos ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ logged, setLogged ] = useState(false)
    const urlRemoveFavorite = `${url}/remove-favorite`
    
    useFocusEffect(
        useCallback(() => {
            getFavorites()
            userLoged()
        }, [])
    )
    const getFavorites = async () => {
        setIsLoading(true)
        const token = await AsyncStorage.getItem('token')
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        const formData = new FormData()
        formData.append('token', token)
        await fetch(urlGetfavorites, {
            method: 'POST',
            headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
            body: formData
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            setPlatos(responseJSON.favorite)
            setIsLoading(false)
        })
    }
    const userLoged = async () => {
        const token = await AsyncStorage.getItem('token')
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        const urlLogin = `${url}/check-user`
        const formData = new FormData()
        formData.append('token', token)
        await fetch(urlLogin, {
            method: 'POST',
            headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
            body: formData
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            if(responseJSON.user){
                setLogged(true)
            }else if(responseJSON.code ===  402){
                alert("usuario no logueado")
                setLogged(false)
                AsyncStorage.removeItem('token')
            }
        })
        .catch((error) => {
            setLogged(false)
            console.log(error)
            AsyncStorage.removeItem('token')
        })
    }   
    
    if(!logged){
        return (<UserNotLogued navigation={navigation} /> )
    }
    function NotFoundPlato(){
        return(
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" ,marginTop: 20 }} >
                <Icon 
                    type="material-community"
                    name="alert-outline"
                    size={50}
                />
                <Text style={{ fontSize: 20, fontWeight: "bold" }} >No hay platos favoritos</Text>
            </View>
        )
    }

    function UserNotLogued(props){
        const { navigation } = props
        return (
            <View>
                <Icon 
                    type="material-community"
                    name="alert-outline"
                    size={50}
                />
                <Text style={{ fontSize: 20, fontWeight: "bold" }} >Necesitas estar logueado para ver esta sección</Text>
                <Button 
                    title="Ir al login"
                    containerStyle={{ marginTop: 20 }}
                    buttonStyle={{ backgroundColor: "orange" }}
                    onPress={() => navigation.navigate("account", {screen: "login"})}
                />
            </View>
        )
    }

    function Platos(props){
        const { plato } = props
        const { name, img } = plato.item

        const removeFavorite = async () => {
            const token = await AsyncStorage.getItem('token')
            const value = await AsyncStorage.getItem('@MySuperStore:666999')
            const formData = new FormData()
            formData.append('token', token)
            formData.append('id', plato.item.id)
            await fetch(urlRemoveFavorite, {
                method: 'POST',
                headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
                body: formData
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                if(responseJSON.status === 'success'){
                    navigation.reset({
                        index: 0,
                        routes: [{name : "favorites"}]
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
        const goToPlato = () => {
            navigation.navigate("Plato", {
                plato: plato 
            })
        }
        const confirmRemoveFavorite = () => {
            Alert.alert(
                "Eliminar Plato de Favoritos",
                "¿Estas seguro?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Eliminar",
                        onPress: removeFavorite
                    }
                ],
                {cancelable: false}
            )
        } 
        return(
            <View style={styles.plato}> 
                <TouchableOpacity onPress={() => goToPlato()}>
                    <Image 
                        resizeMode="cover"
                        style={styles.image}
                        PlaceholderContent={<ActivityIndicator color="#000"/>}
                        source={
                            img ? { uri : `${url}/get-file/${img.split(',')[0]}` } : require("../../assets/img/default-image.png")
                        }
                    />
                    <View style={styles.viewInfo}>
                        <Text style={styles.txtName} >{name}</Text>
                        <Icon 
                            type="material-community"
                            name="heart"
                            color="#f00"
                            containerStyle={styles.iconFavorite} 
                            onPress={confirmRemoveFavorite}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View>
            {platos.length ? (
                <FlatList 
                    data={platos}
                    renderItem={(plato) => <Platos plato={plato}/> }
                    keyExtractor={(item, index) => index.toString() }
                /> 
            ) : (
                <NotFoundPlato />
            )}
            <Loading isVisible={isLoading} text="Cargando..." /> 
        </View> 
    )
}

const styles = StyleSheet.create({
    viewbody: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    leaderPlatos: {
        marginTop: 10,
        marginBottom: 10
    },
    plato: {
        margin: 10
    },
    image: {
        width: "100%",
        height: 180
    },
    viewInfo: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: -30,
        backgroundColor: "#fff"
    },
    txtName: {
        fontWeight: "bold",
        fontSize: 30,
    },
    iconFavorite: {
        marginTop: -30,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100
    },
    cancel: {

    }
})