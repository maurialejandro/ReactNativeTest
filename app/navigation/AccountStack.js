import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import Account from "../screens/Account/Account"
import Login from "../screens/Account/Login"
import Register from "../screens/Account/Register"

const Stack = createStackNavigator();

export default function AccountStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="Top Restaurant"
                component={Account}
                options={{ title:"Cuenta" }}
            />
            <Stack.Screen 
                name="login"
                component={Login}
                options= {{ title: "Iniciar sesion" }}
            />
            <Stack.Screen 
                name="register"
                component={Register}
                options={{ title: "Registrar" }}
            />
        </Stack.Navigator>
    )
}