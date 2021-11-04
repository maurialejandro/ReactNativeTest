import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Platos from "../screens/Platos/Platos";
import AddPlatos from "../screens/Platos/AddPlatos";
import Plato from "../screens/Platos/Plato"
import AddReviewPlato from "../components/Platos/AddReviewPlato";

const Stack = createStackNavigator();

export default function PlatosStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="plato"
                component={Platos}
                options={{ title:"Platos" }}
            />
            <Stack.Screen 
                name="add-platos"
                component={AddPlatos}
                options={{title: "Añadir nuevos platos"}}
            />
	        <Stack.Screen 
		        name="Plato"
	  	        component={Plato}
	        />
            <Stack.Screen
                name="add-review-plato"
                component={AddReviewPlato}
                options={{title: "Añadir comentario"}}
            />
        </Stack.Navigator>
    )
}
