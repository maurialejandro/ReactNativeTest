import React from "react"
import MapView from "react-native-maps"
import openMap from "react-native-open-maps"

export default function Map(props){
    const { latitude, longitude, latitudeDelta, longitudeDelta, name, height } = props
    const openAppMap = () => {
        openMap({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            zoom: 18,
            query: name
        })
    }
    return(
        <MapView
            style={{ height: height, width: "100%" }}
            onPress={openAppMap}
            initialRegion={{
                latitude: parseFloat(latitude), 
                longitude: parseFloat(longitude),
                latitudeDelta: parseFloat(latitudeDelta),
                longitudeDelta: parseFloat(longitudeDelta)
            }}
            zoom={12}
        >
            <MapView.Marker 
                coordinate={{
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    latitudeDelta: parseFloat(latitudeDelta),
                    longitudeDelta: parseFloat(longitudeDelta)
                }}
            />
        </MapView> 
    )
}