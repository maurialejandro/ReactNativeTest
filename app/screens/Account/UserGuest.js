import React from "react"
import { View, Text, StyleSheet, ScrollView, Image } from "react-native"
import { Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native"

export default function UserGuest(){
    const navigation = useNavigation()
 
    return(
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image
                source={require("../../../assets/img/IMG_9211.jpg")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil de 5 tenedores</Text>
            <Text style={styles.description}>
                ¿Como describirías tu mejor plato de comida? Busca y visualiza los mejores
                platos de comida de todo dipo, vota cual te ah gustado más y comenta tu experiencia.
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    title="Ve tu perfil"
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate("login")}

                />
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 1,
        marginTop: 1
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40
    },
    title:{
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center"
    },
    description:{
        textAlign:"center",
        marginBottom: 20 
    },
    viewBtn: {
        flex: 1,
        alignItems: "center",

    },
    btnStyle: {
        backgroundColor: "orange"
    },
    btnContainer:{
        width: "70%",
        backgroundColor: "orange"
    }
})  