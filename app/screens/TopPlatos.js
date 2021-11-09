import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import Loading from "../components/Loading";
import { Icon } from "react-native-elements"

export default function TopPlatos(){
    const urlGetBestRating = `${url}/get-best-rating`
    const [ isLoading, setIsLoading ] = useState(false)
    const [ platos, setPlatos ] = useState([])
    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            getBestRating()
        }, [])
    )
    const getBestRating = async () => {
        setIsLoading(true)
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        const token = await AsyncStorage.getItem('token')
        const formData = new FormData()
        formData.append('token', token)
        await fetch(urlGetBestRating, {
            method: 'POST',
            headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
            body: formData
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            setIsLoading(false)
            if(responseJSON.status === "success"){
                setPlatos(responseJSON.best_rating)
            }else{

            }
        })
        .catch((error) => {
            setIsLoading(false)
            console.log(error)
        })
    }
    
    function NotFoundPlato(){
        return(
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" ,marginTop: 20 }} >
                <Icon 
                    type="material-community"
                    name="alert-outline"
                    size={50}
                />
                <Text style={{ fontSize: 20, fontWeight: "bold" }} >No hay platos con mejor rating</Text>
            </View>
        )
    }
    function Platos(props){
        const { plato } = props
        const { name, img } = plato.item
        const { navigation } = props
        const goToPlato = () => {
            navigation.navigate("platos", {
                screen: "Plato",
                params: {plato: plato} 
            })
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
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View>
            { platos.length ? (
                <FlatList 
                    data={platos}
                    renderItem={(plato) => <Platos plato={plato} navigation={navigation} /> }
                    keyExtractor={(item, index) => index.toString() }
                /> 
            ) : (
                <NotFoundPlato /> 
            )}
            <Loading isVisible={isLoading} text="cargando" /> 
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