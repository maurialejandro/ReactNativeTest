import React from "react"
import { Image } from "react-native-elements"
import Carousel from "react-native-snap-carousel"

export default function CarouselImages(props){
    const { arrayImage, height, width } = props
    const renderItem = ({item}) => {
		return <Image style={{ width, height }} source={{ uri: `http://192.168.0.7:8000/api/get-file/${item}` }} />
    }
    return(
	<Carousel
	    layout={"default"}
		data={arrayImage}
	    renderItem={renderItem}
	    sliderWidth={width}
	    itemWidth={width}
	/>
    )
}

