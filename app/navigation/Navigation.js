import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';

import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import AccountStack from "./AccountStack";
import SearchStack from "./SearchStack";
import TopRestaurantsStack from "./TopRestaurantStack";

/*import Restaurant from "../screens/Restaurants";
import Favorites from "../screens/Favorirites";
import Account from "../screens/Account";
import Search from "../screens/Search";
import TopRestaurant from "../screens/TopRestaurants";
*/
const Tab = createBottomTabNavigator();

export default function App(){
    return (
        <NavigationContainer>
            <Tab.Navigator 
                initialRouteName="account"
                tabBarOptions={{ 
                    inactiveTintColor: "#646464", 
                    activeTintColor: "#C2751A"
                }}
                
                screenOptions={({route}) => ({
                    tabBarIcon: ({color}) => screenOptions(route, color)
                })}
            >
               <Tab.Screen name="restaurants" options={{ title: "Restaurant" }} component={RestaurantsStack} />
               <Tab.Screen name="favorites" options={{ title: "Favorites" }} component={FavoritesStack} />
               <Tab.Screen name="account" options={{ title: "Account" }} component={AccountStack} />
               <Tab.Screen name="search" options={{ title: "Search" }} component={SearchStack} />
               <Tab.Screen name="top-restaurant" options={{ title: "Top Restaurant" }} component={TopRestaurantsStack} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

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