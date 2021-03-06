import React from "react"
import { NavigationContainer} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'
import { StyleSheet } from "react-native"
import PlatosStack from "./PlatosStack"
import FavoritesStack from "./FavoritesStack"
import AccountStack from "./AccountStack"
import SearchStack from "./SearchStack"
import TopPlatosStack from "./TopPlatosStack"

const Tab = createBottomTabNavigator();

export default function App(){

    return (
        <NavigationContainer>
            <Tab.Navigator 
               	initialRouteName="account"
                screenOptions={({route}) => ({
                    tabBarIcon: ({color}) => screenOptions(route, color),
                })}
            >
               <Tab.Screen name="platos" options={{ title: "Platos" }} component={PlatosStack} />
               <Tab.Screen name="favorites" options={{ title: "Favorites" }} component={FavoritesStack} />
               <Tab.Screen name="search" options={{ title: "Search" }} component={SearchStack} />
               <Tab.Screen name="top-platos" options={{ title: "Top Platos" }} component={TopPlatosStack} />
               <Tab.Screen name="account" options={{ title: "Account" }} component={AccountStack} />
            </Tab.Navigator>
       </NavigationContainer>
    )
}
const styles = StyleSheet.create({
    tabBarOptions: {
        backgroundColor: "#646464", 
        borderColor: "#C2751A"
    }
})
function screenOptions(route, color){
    let iconName;

    switch (route.name) {
        case "platos":
            iconName = "compass-outline"
            break;
        case "favorites":
            iconName = "heart-outline"
            break;    
        case "top-platos":
            iconName = "star-outline"
            break;
        case "account":
            iconName = "home-outline"
            break;
        case "search":
            iconName = "magnify"
            break;   
        default:
            break;
    }
    return (
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )
}
