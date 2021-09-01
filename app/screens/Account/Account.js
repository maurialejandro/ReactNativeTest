import React, { useState, useEffect, Component } from "react";
import { View, Text, AsyncStorage, Button } from "react-native";
import  apiLogin  from "../../src/services/apiLogin";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";

class Account extends Component{
    
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
    // Obtener variables del login 
    render(){
      return <UserGuest onSubmit={this.onSubmit} />;
    }
}
export default Account;