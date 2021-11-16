import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { SearchBar, ListItem, Icon, Avatar } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Search(props){
    const { navigation } = props
    const [ search, setSearch ] = useState("")
    const [ elements, setElements ] = useState({})

    const urlSearch = `${url}/search`
    useEffect(() => {
        if(search !== ""){
            searchSend(search)
        }
    },[search])

    const searchSend = async (data) => {
        const formData = new FormData()
        const token = await AsyncStorage.getItem('token')
        const value = await AsyncStorage.getItem('@MySuperStore:666999')
        formData.append('token', token)
        formData.append('search', data)
        await fetch( urlSearch, {
            method: 'POST',
            headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
            body: formData
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            setElements(responseJSON)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    return(
        <View>
            <SearchBar 
                placeholder="Busca tu plato"
                onChangeText={ (e) => setSearch(e) }
                containerStyle={styles.SearchBar}
                value={search}
            />
            {elements.length > 0 ? (
                <FlatList 
                    data={elements}
                    renderItem={(element) => <Plato navigation={navigation} element={element} />}
                    keyExtractor={(id, item) => id.toString()}
                />
                ) : (
                <NoPlatos navigation={navigation}/>
            )}
        </View>
    )
}
function Plato(props){
    const {navigation, element} = props
    const { name, img } = element.item
    return(
        <ListItem bottomDivider onPress={() => {
            navigation.navigate('platos', {
                screen: 'Plato',
                initial: false,
                params: { plato: element }
            })
        }} >
            <Avatar source={
			    	img ? { uri : `${url}/get-file/${img.split(',')[0]}` } : require("../../assets/img/default-image.png")
				} />
            <ListItem.Content>
              <ListItem.Title>{name}</ListItem.Title>
            </ListItem.Content>
            <Icon name="chevron-right" />
        </ListItem>
    )
}
function NoPlatos(props){
    const {navigation} = props
    return(
        <View style={{ flex: 1, alignItems: "center" }}>
            <Image 
                source={require("../../assets/img/data-not-found.png")}
                resizeMode="cover"
            />
        </View>
    )
}
const styles = StyleSheet.create({
    SearchBar:{
        marginBottom: 20
    }
})