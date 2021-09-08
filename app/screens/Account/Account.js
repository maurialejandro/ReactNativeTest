import React, { useState, useEffect, Component } from "react"
import UserGuest from "./UserGuest"
import UserLogged from "./UserLogged"
import Loading from "../../components/Loading"

export default function Account(){
    const [login, setLogin] = useState(true)
    
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

  onSubmit = async () => {
    console.log(this);
    try {
      const result = await apiLogin();
      alert(result);
    } catch (error) {
      console.log(error);
    }
  }
  prueba = async () => {
    alert("aqo");
  }
};
    if(login === null) return <Loading isVisible={true} text="Cargando.."/> 
    return login ? <UserLogged/> : <UserGuest/>;
  
}