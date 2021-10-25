import React from "react"
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native"
import { Image } from "react-native-elements"
import { size } from "lodash"
 
export default function ListPlatos(props){
    const { platos } = props
    
    return(
	<View>
	    {size(platos) > 0 ? (
	        <FlatList 
		    data={platos}
		    renderItem={(plato) => <Platos platos={plato} />}
		    keyExtrator={(item, index) => index.toString()}
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
    const { platos } = props
    
    return(
    	<View>
	    <Text>Platos</Text>
	</View>
    )
}
const styles = StyleSheet.create({
    loaderPlatos: {
        marginTop: 10,
	marginBottom: 10,
	alignItems: "center"
    }
})
