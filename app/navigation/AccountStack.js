import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/Account/Account";

const Stack = createStackNavigator();

export default function AccountStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Top Restaurant"
                component={Account}
                options={{ title:"Cuenta" }}
            />
        </Stack.Navigator>
    )
}