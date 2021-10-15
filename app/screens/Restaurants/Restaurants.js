import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Icon } from "react-native-elements"

export default function Restaurants(){

    return(
        <View style={styles.viewBody} >
            <Text>Restaurant</Text>
            <Icon
                reverse
                type="material-community"
                name="plus"
                color="#00a680"
                containerStyle={styles.btnContainer}
            />
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