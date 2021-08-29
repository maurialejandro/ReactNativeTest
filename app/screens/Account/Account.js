import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";

import UserGuest from "./UserGuest";
import UaserLogged from "./UserLogged";

export default function Account(){

    const login = useState(null);
    const setLogin = useState(null); 
    const [data, setData] = useState([]);

    // Obtener variables del login 
    
    useEffect(() => {
        // conectar con api User esta log enviar true si no enviar false 
        // configuracion 
        // login si no esta registrado crear componente de registro 

    })

    return (
        <View>
            <Text>A</Text>
        </View>
    )
}