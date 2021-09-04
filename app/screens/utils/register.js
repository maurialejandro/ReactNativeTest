import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export function registerUser(formData){
  return fetch('http://192.168.1.108:8000/api/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': 'rAmexi7UB4mUmeL6vRQ5buzftRTuuDrztA9YeltC'
    },
    body: JSON.stringify({
      name: formData.email,
      email: formData.email,
      password: formData.password
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {

   console.log(responseJson)
  })
  .catch((error) =>{
    console.error(error);
  });
}