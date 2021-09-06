import React, {useState} from "react"

export function getToken(){
    const [items, setItems] = useState([]);

    fetch('http://192.168.1.5:8000/api/token')
    .then((response) => {
        setItems(response)
        return items
    })
    .catch((error) => {
        console.log(error)
    })
}