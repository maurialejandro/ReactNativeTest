import React, { useEffect, useState } from "react"
import { StyleSheet, View, Text } from "react-native"
import { Icon } from "react-native-elements"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ListPlatos from "../../components/Platos/ListPlatos"

export default function Platos(props){
    const { navigation } = props
    const [ user, setUser ] = useState(null)
    const [ platos, setPlatos ] = useState([])
    const [ totalPlatos, setTotalPlatos ] = useState(null)
    const [ contPlato, setContPlato ] = useState(null)
    const [ skipPlatos, setSkipPlatos ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)
    const urlPlatos = 'http://192.168.0.7:8000/api/get-plato'
    const urlInfo = 'http://192.168.0.7:8000/api/info-user'
    const limitPlatos = 10
    console.log(skipPlatos)
    useEffect(() => {
        ((async = () => {
            getData()
	    getTotalPlatos()
	    getPlatos()
        }))()
    },[])
    let getData = async () => {
        const token = await AsyncStorage.getItem('token')
    	const value = await AsyncStorage.getItem('@MySuperStore:666999')
        await fetch(urlInfo, {
            method: 'POST',
            headers: { 'Content-type' : 'application/json', 'X-CSRF-TOKEN': value},
            body: JSON.stringify({
                'token': token
            })
        })
        .then((response) => response.json())
        .then((responseJSON) => {
                if(responseJSON){
                    setUser(responseJSON)
                }
        })
        .catch((error) => {
            AsyncStorage.removeItem('token')
            console.log(error)
        })
    }
    let getTotalPlatos = async () => {
    	const value = await AsyncStorage.getItem('@MySuperStore:666999')
	const token = await AsyncStorage.getItem('token')
	const formData = new FormData()
	const resultPlatos = []
	formData.append('token', token)	
	await fetch(urlPlatos,{
	    method: 'POST',
	    headers: { 'Content-type': 'multipart/form-data', 'X-CSRF-TOKEN': value },
	    body: formData
	})
	.then((response) => response.json())
	.then((responseJSON) => {
	    //devolver solo un maximo de 10 restaurantes
	    setTotalPlatos(responseJSON.length)
	})
	.catch((error) => {
	    console.log(error)
	})
    }

    let getPlatos = async () => {
  	// Obtener los primeros 10 platos
	const value = await AsyncStorage.getItem('@MySuperStore:666999')
	const token = await AsyncStorage.getItem('token')
	const formData = new FormData()
  	formData.append('token', token)
	formData.append('size', limitPlatos)
	formData.append('skip', skipPlatos)
	await fetch(urlPlatos, {
	    method: 'POST',
	    headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
	    body: formData
	})
	.then((response) => response.json())
	.then((responseJSON) => {
	    setPlatos(responseJSON)
	    if(totalPlatos > 10){
		setSkipPlatos(totalPlatos - 10)
	    }
	})
	.catch((error) => console.log(error))
    }
    let getNextPlatos = async () => {
	//Obtener los siguientes 10 plato
	skipPlatos < totalPlatos && setIsLoading(true)
	
	const value = await AsyncStorage.getItem('@MySuperStore:666999')
	const token = await AsyncStorage.getItem('token')
	const formData = new FormData()
	formData.append('token', token)
	formData.append('skip', limitPlatos)
	formData.append('size', totalPlatos)
	console.log(formData)
	await fetch(urlPlatos, {
	    method: 'POST',
	    headers: { 'Contect-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
	    body: formData
	})
	.then((response) => response.json())
	.then((responseJSON) => {
	    setPlatos(responseJSON)
	    console.log(responseJSON.length)
	})
    }
    return(
        <View style={styles.viewBody} >
            <ListPlatos 
	    	platos={platos}
		getNextPlatos={getNextPlatos}
		isLoading={isLoading}
   	    />
            { user && (
                <Icon
                    reverse
                    type="material-community"
                    name="plus"
                    color="#00a680"
                    containerStyle={styles.btnContainer}
                    onPress={ () => navigation.navigate('add-platos') }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right:10,
        shadowColor: "black",
        shadowOffset: {
            width: 2, height: 2
        },
        shadowOpacity: 0.5
    }
})
