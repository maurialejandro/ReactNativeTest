import React, {useState} from "react"
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native"
import { Image } from "react-native-elements"
import { size } from "lodash"
import { useNavigation } from "@react-navigation/native"

export default function ListPlatos(props){
    const { platos, isLoading, getNextPlatos } = props
    const navigation = useNavigation()
    return(
	<View>
	    {size(platos) > 0 ? (
	        <FlatList
		    	data={platos}
		    	renderItem={(plato) => <Platos navigation={navigation} plato={plato}/>}
		    	keyExtractor={(item, index) => index.toString()}
		    	onEndReachedThreshold={0.5}
		    	onEndReached={getNextPlatos}
		    	ListFooterComponent={<FooterList isLoading={isLoading} />}
			/>
 	    ) : (
	        <View style={styles.loaderPlatos}>
		    <ActivityIndicator size="large" /> 
		    <Text>Cargando Platos</Text>
		</View>
	    )}
	</View>
    )
}

function Platos(props){
    const { plato, navigation } = props
    const { img, name, price, description } = plato.item
    const goToPlato = () => {
		navigation.navigate("Plato", {
		    plato: plato 
		})
    }
    return(
    	<TouchableOpacity onPress={() => goToPlato()}>
	    <View style={styles.viewPlato}>
		<View style={styles.viewPlatoImage} >
		    <Image
			resizeMode="cover"
			PlaceholderContent={<ActivityIndicator color="#000"/>}
		    	source={
			    	img ? { uri : `${url}/get-file/${img.split(',')[0]}` } : require("../../../assets/img/default-image.png")
				}
			style={styles.imagePlato}
		    />
		</View>
		<View>
		    <Text style={styles.txtName} >{name}</Text>
		    <Text style={styles.txtPrice} >${price}</Text>
		    <Text style={styles.txtDescription} >{description.substr(0, 36)}...</Text>
		</View>
	    </View>
	</TouchableOpacity>
    )
}
function FooterList(props){
    const { isLoading } = props
    if(isLoading){
		return (
		    <View style={styles.loadingPlato}>
				<ActivityIndicator size="large" />
		    </View>
		)
    }else{
		return(
		    <View style={styles.notFoundPlato}>
			<Text>No quedan platos que mostrar</Text>
		    </View>
		)
    }
}
const styles = StyleSheet.create({
    loaderPlatos: {
        marginTop: 10,
		marginBottom: 10,
		alignItems: "center"
    },
    viewPlato: {
    	flexDirection: "row",
		margin: 10
    },
    viewPlatoImage: {
    	marginRight: 15
    },
    imagePlato: {
		width: 80,
		height: 80
    },
    txtName: {
		fontWeight: "bold"
    },
    txtPrice: {
		paddingTop: 2,
		color: "black"
    },
    txtDescription: {
		paddingTop: 2,
		color: "grey",
		width: 300
    },
    loadingPlato: {
		marginTop: 10,
		marginBottom: 10,
		alignItems: "center"
    },
    notFoundPlato: {
		marginTop: 10,
		marginBottom: 20,
		alignItems: "center"
    }
})
