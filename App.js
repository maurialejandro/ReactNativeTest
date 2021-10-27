import React from 'react';
import Navigation from "./app/navigation/Navigation";
const apiUrl = 'http://192.168.0.7'
  export default function App() {
  return (
    <Navigation apiUrl={apiUrl} />  
  )
}
