import React, {useState, useRef} from 'react'
import { View, Text } from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AddPlatoForm from '../../components/Platos/AddPlatoForm'

export default function AddPlatos(props){
    const { navigation } = props
    const toastRef = useRef()
    const [ isLoading, setIsLoading ] = useState(false)
    
    return(
        <View>
            <AddPlatoForm 
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
            /> 
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Creando Restaurante" />
        </View>
    )
}
