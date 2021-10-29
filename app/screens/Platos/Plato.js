import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import Carousel from "../../components/Carousel"

export default function Plato(props){
    const { navigation, route } = props
    const { name, price, description, img, latitude, longitude } = props.route.params.plato.item
    navigation.setOptions({ title: name })
    return(
	<ScrollView vertical style={styles.viewBody} >
	    <Carousel
		arrayImage={arrayImage}
	    />
	</ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
 	flex: 1,
	backgroundColor: "#fff"
    }
})
