import React,{ useState, useEffect, useRef } from "react"
import { LogBox, View, Text, StyleSheet, ScrollView, Dimensions } from "react-native"
import { Rating, Icon } from "react-native-elements"
import Carousel from "../../components/Carousel"
import Map from "../../components/Map"
import ListReview from "../../components/Platos/ListReviews"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-easy-toast"

export default function Plato({ route, navigation }){
    const { plato } = route.params
    const { img, name, review, description, latitude, longitude, price, rating, rating_total, quantity_voting, longitudeDelta, latitudeDelta, is_favorite } = plato.item
    const screenWidth = Dimensions.get("window").width
    const arrayImage = img.split(",")
    const [ isFavorite, setIsFavorite ] = useState(false)
    const [ userLogged, setUserLogged ] = useState(false)
    const toastRef = useRef()
    const urlAddFavorite = `${url}/add-favorite`
    const urlRemoveFavorite = `${url}/remove-favorite`
    
    useEffect(() => {
        userLoged()
        console.log(is_favorite)
        if(is_favorite === true){
            setIsFavorite(true)
        }
    }, [])
    
    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state'
    ])
    
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: name ? name : 'No title',
        });
    }, [navigation, name]);

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
                setUserLogged(true)
            }else if(responseJSON.code ===  402){
                alert("usuario no logueado")
                setUserLogged(false)
                AsyncStorage.removeItem('token')
            }
        })
        .catch((error) => {
            setUserLogged(false)
            console.log(error)
            AsyncStorage.removeItem('token')
        })
    }
    const addFavorite = async () => {
        const token = await AsyncStorage.getItem('token')
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        const formData = new FormData()
        formData.append('token', token)
        formData.append('id', plato.item.id)
        await fetch(urlAddFavorite, {
            method: 'POST',
            headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
            body: formData
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            if(responseJSON.status === 'success'){
                setIsFavorite(true)
                toastRef.current.show("Plato se agrego a los favoritos")
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

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
                setIsFavorite(false)
                toastRef.current.show("Plato se quito de los favoritos")
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return(
	    <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon 
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    color={isFavorite ? "#f00" : "#000"}
                    size={35}
                    underlayColor="transparent"
                />
            </View>
	        <Carousel
	    	    arrayImage={arrayImage}
                height={250}
                width={screenWidth}
	        />
            <TitlePlato 
                name={name} 
                description={description} 
                price={price} 
                latitude={latitude}
                longitude={longitude}
                latitudeDelta={latitudeDelta}
                longitudeDelta={longitudeDelta}
                rating={rating}
                rating_total={rating_total}
                quantity_voting={quantity_voting}
            /> 
            <ListReview 
                navigation={navigation}
                plato={plato}
            />
            <Toast ref={toastRef} position="center"opacity={0.9} /> 
        </ScrollView>
    )

    function TitlePlato(props) {
        const { name, description, price, latitude, longitude, latitudeDelta, longitudeDelta } = props
        return (
            <View style={styles.viewPlatoTitle}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.txtNamePlato} >{name}</Text>
                </View>
                <Rating 
                    style={styles.rtg}
                    imageSize={18}
                    readonly
                    startingValue={rating}
                />
                <Text style={styles.txtDescPlato} >{description}</Text>
                <Text style={styles.txtDescPlato} >${price}</Text>
                <PlatoInfo 
                    latitude={latitude} 
                    longitude={longitude} 
                    name={name} 
                    latitudeDelta={latitudeDelta} 
                    longitudeDelta={longitudeDelta} 
                />
                <Text style={styles.txtNamePlato}>Comentario</Text>
                <Text>{review ? review : "Aun no existe comentario"}</Text>
            </View>
        )
    }

    function PlatoInfo(props) {
        const { latitude, longitude, latitudeDelta, longitudeDelta, name } = props
      
        return (
            <View style={styles.viewPlatoInfo} >
                <Text style={styles.txtPlatoInfo} >
                    Información sobre el plato
                </Text>
                <Map 
                    name={name}
                    latitude={latitude}
                    longitude={longitude}
                    latitudeDelta={latitudeDelta}
                    longitudeDelta={longitudeDelta}
                    height={100}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewBody: {
 	    flex: 1,
	    backgroundColor: "#fff"
    },
    viewPlatoTitle: {
        padding: 15
    },
    txtNamePlato: {
        fontSize: 20,
        fontWeight: "bold"
    },
    txtDescPlato: {
        marginTop: 5,
        color: "grey"        
    },
    rtg: {
        position: "absolute",
        right: 20,
        marginTop: 15
    },
    viewPlatoInfo: {
        margin: 15,
        marginTop: 25
    },
    txtPlatoInfo: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    viewFavorite: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 7,
        paddingLeft: 15
    }
})
