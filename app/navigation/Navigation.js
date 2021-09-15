import React from "react"
import { NavigationContainer, useIsFocused } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'
import { StyleSheet } from "react-native"
import RestaurantsStack from "./RestaurantsStack"
import FavoritesStack from "./FavoritesStack"
import AccountStack from "./AccountStack"
import SearchStack from "./SearchStack"
import TopRestaurantsStack from "./TopRestaurantStack"

const Tab = createBottomTabNavigator();

export default function App(){

    return (
        <NavigationContainer>
            <Tab.Navigator 
                initialRouteName="account"
                style={styles.tabBarOptions}
                screenOptions={({route}) => ({
                    tabBarIcon: ({color}) => screenOptions(route, color),
                })}
            >
               <Tab.Screen name="restaurants" options={{ title: "Restaurant" }} component={RestaurantsStack} />
               <Tab.Screen name="favorites" options={{ title: "Favorites" }} component={FavoritesStack} />
               <Tab.Screen name="search" options={{ title: "Search" }} component={SearchStack} />
               <Tab.Screen name="top-restaurant" options={{ title: "Top Restaurant" }} component={TopRestaurantsStack} />
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
        case "restaurants":
            iconName = "compass-outline"
            break;
        case "favorites":
            iconName = "heart-outline"
            break;    
        case "top-restaurant":
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