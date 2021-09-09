import React, { useState, useEffect} from "react"
import UserGuest from "./UserGuest"
import UserLogged from "./UserLogged"
import Loading from "../../components/Loading"
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Account(){
    const [login, setLogin] = useState(false)
    const urlToken = 'http://192.168.1.5:8000/api/token'

    useEffect(() => {
        (async = () => {
            let data = fetch(urlToken).then((response) => response.json()).then((json) => {
                _storeData(json.token)
            })        
        })()

      }, [])
      _storeData = async (token) => {
          try {
              await AsyncStorage.setItem(
                  '@MySuperStore:666999',
                  token
              );
          } catch (error) {
            console.log(error)
          }
      };
    if(login === null) return <Loading isVisible={true} text="Cargando.." /> 
    return login ? <UserLogged/> : <UserGuest/>
  
}