import React,{useState} from "react"
import { LogBox, View, Text, StyleSheet, ScrollView, Dimensions } from "react-native"
import { Rating } from "react-native-elements"
import Carousel from "../../components/Carousel"
import Map from "../../components/Map"

export default function Plato({ route, navigation }){
    const { plato } = route.params
    const { img, name, description, latitude, longitude, price, rating, rating_total, quantity_voting, longitudeDelta, latitudeDelta } = plato.item
    const screenWidth = Dimensions.get("window").width
    const arrayImage = img.split(",")

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state'
    ])
    
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: name ? name : 'No title',
        });
    }, [navigation, name]);

    return(
	    <ScrollView vertical style={styles.viewBody}>
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
                <PlatoInfo latitude={latitude} longitude={longitude} name={name} latitudeDelta={latitudeDelta} longitudeDelta={longitudeDelta} />
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

})
