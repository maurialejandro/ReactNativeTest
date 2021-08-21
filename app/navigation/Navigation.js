import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createButtomTabNavigator } from '@react-navigation/bottom-tabs';
import Restaurant from "../screens/Restaurants";
import Favorites from "../screens/Favorirites";

const Tab = createButtomTabNavigator();

export default function App(){
    return (
        <NavigationContainer>
            <Tab.Navigator>
               <Tab.Screen name="Restaurant" options={{ title: "Restaurant" }} component={Restaurant} />
               <Tab.Screen name="Favorites " options={{ title: "Favorites" }} component={Favorites} />
                
            </Tab.Navigator>
        </NavigationContainer>
    )
}