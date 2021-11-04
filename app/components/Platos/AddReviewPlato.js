import React, { useState, useRef } from "react"
import { View, Text, StyleSheet } from "react-native"
import { AirbnbRating, Button, Input } from "react-native-elements"
import { ScrollView } from "react-native-gesture-handler"
import Toast from "react-native-easy-toast"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Loading from "../../components/Loading"

export default function AddReviewPlato({navigation, route}){
    const { plato } = route.params
    const [ rating, setRating ] = useState(null)
    const [ review, setReview ] = useState("")
    const [ isLoading, setIsLoading ] = useState(false)
    const urlStorePuntuation = `${url}/store-puntuation`
    const toastRef = useRef()

    const addReview = async () => {
        if(!rating){
            toastRef.current.show("No has dado ninguna puntuación")
        } else if(!review){
            toastRef.current.show("El comentario es obligatorio")
        } else {
            const token = await AsyncStorage.getItem('token')
            const value = await AsyncStorage.getItem('@MySuperStore:666999')
            const formData = new FormData()
            formData.append('token', token)
            formData.append('review', review)
            formData.append('rating', rating)
            formData.append('id', plato.item.id)
            setIsLoading(true)
            await fetch(urlStorePuntuation ,{
                method: 'POST',
                headers: { 'Content-type' : 'multipart/form-data', 'X-CSRF-TOKEN' : value },
                body: formData
            })
            .then((response) => response.json())
            .then((responseJSON) => { 
                setIsLoading(false)
                if(responseJSON.status === "success"){
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'plato' }]
                    })
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
            })
        }
    }

    return(
        <ScrollView>
            <View style={styles.viewBody} >
                <View style={styles.viewRating} >
                    <AirbnbRating 
                        count={5}
                        reviews={["Pésimo", "Deficiente", "Normal", "Bueno", "Excelente"]}
                        defaultRating={3}
                        size={30}
                        onFinishRating={(value) => {setRating(value)}}
                    />
                </View>
                <View style={styles.formReview} >
                    <Input 
                        placeholder="Comentario"
                        multiline={true}
                        inputContainerStyle={styles.txtArea}
                        onChange={(e) => setReview(e.nativeEvent.text)}
                    />
                    <Button 
                        title="Enviar Comentario"
                        containerStyle={styles.btnContainer}
                        buttonStyle={styles.btn}
                        onPress={addReview}
                    /> 
                </View>
                <Toast ref={toastRef} position="center" opacity={0.9} />
                <Loading isVisible={isLoading} text="Cargando comentario" />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40
    },
    input: {
        marginBottom: 10
    },
    txtArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%"
    },
    btn: {
        backgroundColor: "orange"
    }

})