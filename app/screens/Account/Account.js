import React, { useState, useEffect} from "react"
import UserGuest from "./UserGuest"
import UserLogged from "./UserLogged"
import Loading from "../../components/Loading"
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Account(){
    const [login, setLogin] = useState(null)
    const urlToken = 'http://192.168.1.5:8000/api/token'
    
    useEffect(() => {
        (async = () => {
            let data = fetch(urlToken).then((response) => response.json()).then((json) => {
                _storeData(json.token)
            })
            _getToken()        
        
        })()
    }, [])
   
    _storeData = async (appToken) => {
        try {
            await AsyncStorage.setItem(
                '@MySuperStore:666999',
                appToken
            );
        } catch (error) {
          console.log(error) 
        }
    };
    _getToken = async () => {
        console.log("aqui hay que ver que pasa cuando el token expira, manejar errores")
        const token = await AsyncStorage.getItem('token')
        const vall = await AsyncStorage.getAllKeys()
        console.log(vall)
        if(token){
            setLogin(true)
        }else{
            setLogin(false)
        }
    }
      
    if(login === null) return <Loading isVisible={true} text="Cargando.." /> 
    return login ? <UserLogged/> : <UserGuest/>
  
}