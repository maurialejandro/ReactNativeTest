import React, {useState} from "react"

export function getToken(){
    const [items, setItems] = useState([]);

    fetch('http://172.20.10.5:8000/api/token')
    .then((response) => {
        setItems(response)
        return items
    })
    .catch((error) => {
        console.log(error)
    })
}