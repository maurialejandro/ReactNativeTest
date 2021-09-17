import React from "react"
import { StyleSheet, View, Text } from "react-native"
import { Avatar, Icon } from "react-native-elements"
 
export default function InfoUser(props){
    const { 
        userInfo: { photoURL, name, email, exp }
    } = props

    const changeAvatar = () => {
        console.log("change avatar")
    }

    console.log("falta agregar el edit button al avatar no se muestra el icon")
    return (
        <View style={styles.viewUserInfo} >
            <Avatar 
                rounded
                size="large"
                editButton={<Icon 
                        name='account-adit'
                        type='material-community'
                        color='#f50'
                        onPress={() => console.log('hello')}
                    />}
                onEditPress={changeAvatar}
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