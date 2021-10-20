import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopPlatos from "../screens/TopPlatos";

const Stack = createStackNavigator();

export default function TopPlatosStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Top Platos"
                component={TopPlatos}
                options={{ title:"Platos Favoritos" }}
            />
        </Stack.Navigator>
    )
}