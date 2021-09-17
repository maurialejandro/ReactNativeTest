import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Avatar } from "react-native-elements"

export default function InfoUser(props){
    const { 
        userInfo: { photoURL, name, email, exp }
    } = props

    return (
        <View style={styles.viewUserInfo} >
            <Avatar 
                rounded
                size="large"
                showEditButton 
                containerStyle={styles.userInfoAvatar}
                source={ photoURL ? { uri: photoURL } : require("../../../assets/img/avatar2.png") }
            />
            <View>
                <Text> {email} </Text>
                <Text> {name} </Text>
                <Text> {exp} </Text>
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
        marginRight:20,
        backgroundColor: "#C2751A"
    }
})