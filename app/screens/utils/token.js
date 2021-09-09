import React, {useState} from "react"

export async function token(){
    const url = 'http://192.168.1.5:8000/api/token';
    const [token, setToken] = useState(null);
    let response = await fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
        setToken(responseJson.token)
        console.log(token)
    })
 
}