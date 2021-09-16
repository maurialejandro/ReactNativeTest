import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Avatar } from "react-native-elements"

export default function InfoUser(){
    return (
        <View style={styles.viewUserInfo} >
            <Avatar 
                rounded
                size="large"
                showEditButton 
                containerStyle={styles.userInfoAvatar}
            />
            <View>
                <Text>Info User</Text>
            </View>
        </View>
    )
    
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30    
    },
    userInfoAvatar: {
        marginRight:20
    }
})