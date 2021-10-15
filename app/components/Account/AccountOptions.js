import React, {useState} from "react"
import { StyleSheet, View, Text } from "react-native"
import { ListItem, Icon } from "react-native-elements"
import map from "lodash"
import Modal from "../../components/Account/Modal"
import ChangeDisplayName from "./ChangeDisplayName"
import ChangeDisplayEmail from "./ChangeDisplayEmail"
import ChangeDisplayPassword from "./ChangeDisplayPassword"

export default function AccountOptions(props){
    const { userInfo, toastRef } = props
    
    const selectComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(<ChangeDisplayName displayName={userInfo.name} setShowModal={setShowModal} toastRef={toastRef}  />)
                setShowModal(true)
                break;
            case "email":
                setRenderComponent(<ChangeDisplayEmail displayEmail={userInfo.email} setShowModal={setShowModal} toastRef={toastRef} />)
                setShowModal(true)
                break;
            case "password":
                setRenderComponent(<ChangeDisplayPassword setShowModal={setShowModal} toastRef={toastRef} />)
                setShowModal(true)
                break;
                    
            default:
                setRenderComponent(null)
                break;
        }
    }
    const menuOptions = generateOptions(selectComponent)
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

     return (
        <View>
            {menuOptions.map((menu, index) => (
                <ListItem onPress={menu.onPress} containerStyle={styles.menuItems} key={index} bottomDivider>
                    <Icon type={menu.iconType} name={menu.iconNameLeft} color={menu.iconColorLeft} />
                    <ListItem.Content >
                        <ListItem.Title>{menu.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ))}            
            <Modal 
                isVisible={showModal} 
                setIsVisible={setShowModal}
            >
                {renderComponent}
            </Modal>
        </View>
    )
}

function generateOptions(selectComponent){
    return[
        {
            title: "Cambiar nombre y apellidos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("displayName"),
        },
        {
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("email"),
        },
        {
            title: "Cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectComponent("password"),
        }
    ]
}
const styles = StyleSheet.create({
    menuItems: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3"
    },
    overlay: {
        height: "auto",
        width: "90%",
        backgroundColor: "#fff"
    }
})
