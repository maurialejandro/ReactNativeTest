import React, { useState, useEffect } from "react";
import { View, Text, AsyncStorage } from "react-native";

import UserGuest from "./UserGuest";
import UaserLogged from "./UserLogged";

export default function Account(){
    
    _storeData = async () => {
        try {
            await AsyncStorage.setItem(
                '@MySuperStore:123456',
                'I like to save it.'
            );
        } catch (error) {
          // Error saving data
        }
    };
    _retrieveData = async () => {
  try {
    const value = await AsyncStorage.getAllKeys();
 
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
  } catch (error) {
    // Error retrieving data
  }
};const login = useState(null);
    const setLogin = useState(null); 
    const [data, setData] = useState([]);

    // Obtener variables del login 
    useEffect(() => {
        // conectar con api User esta log enviar true si no enviar false 
        // configuracion 
        // login si no esta registrado crear componente de registro 
        _storeData();
        _retrieveData();
    })

    return (
        <View>
            <Text>A</Text>
        </View>
    )
}