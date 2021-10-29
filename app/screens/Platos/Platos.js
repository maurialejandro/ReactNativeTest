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
    const [ contPlatos, setContPlatos ] = useState(null)
    const [ skipPlatos, setSkipPlatos ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)
    const urlPlatos = 'http://192.168.0.7:8000/api/get-plato'
    const urlInfo = 'http://192.168.0.7:8000/api/info-user'
    const [ limitPlatos, setLimitPlatos ] = useState(null)
    const [ newPlatos, setNewPlatos ] = useState([])
    useEffect(() => {
        ((async = () => {
            getData()
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
    let getPlatos = async () => {
    	const value = await AsyncStorage.getItem('@MySuperStore:666999')
	const token = await AsyncStorage.getItem('token')
	const formData = new FormData()
	formData.append('token', token)
	formData.append('skip', 0)
	formData.append('limit', 10)
	await fetch(urlPlatos,{
	    method: 'POST',
	    headers: { 'Content-type': 'multipart/form-data', 'X-CSRF-TOKEN': value },
	    body: formData
	})
	.then((response) => response.json())
	.then((responseJSON) => {
	    // luego de que se carguen los 10 platos se restan y se setea un nuevo total y un skip para saltar los 10 mostrados 
	    // se devolvera un total del back 
	    setTotalPlatos(responseJSON.totalPlatos)
	    setPlatos(responseJSON.platos)
	    if(responseJSON.totalPlatos > 10){
		setSkipPlatos(10)
	    }
	    setContPlatos(totalPlatos - skipPlatos)
	    if(contPlatos < 10){
		setLimitPlatos(10)
	    }else{
		setLimitPlatos(contPlatos)
	    }
	})
	.catch((error) => {
	    console.log(error)
	})
    }
    let getNextPlatos = async () => {
	setContPlatos(totalPlatos - skipPlatos)
	skipPlatos < totalPlatos && setIsLoading(true)
	const value = await AsyncStorage.getItem('@MySuperStore:666999')
	const token = await AsyncStorage.getItem('token')
	const formData = new FormData()
	formData.append('token', token)
	formData.append('skip', skipPlatos)
	formData.append('limit', limitPlatos)
	await fetch(urlPlatos, {
	    method: 'POST',
	    headers: { 'Contect-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
	    body: formData
	})
	.then((response) => response.json())
	.then((responseJSON) => {
	    setIsLoading(false)
	    setPlatos([...platos, ...responseJSON.platos])
	    setSkipPlatos(skipPlatos + limitPlatos) 
	    setLimitPlatos(contPlatos - limitPlatos)
	})
	.catch((error) => console.log(error))
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
