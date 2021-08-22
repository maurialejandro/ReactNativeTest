import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Favorites from "../screens/Favorirites";

const Stack = createStackNavigator();

export default function FavoritesStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Restaurantes Favoritos"
                component={Favorites}
                options={{ title:"Restaurantes Favoritos" }}
            />
        </Stack.Navigator>
    )
}