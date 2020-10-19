import React from "react";
import {
	withScriptjs,
	withGoogleMap,
	GoogleMap,
	Marker,
} from "react-google-maps";


const Map = withScriptjs(
	withGoogleMap((props) => {
		const markerArray =
			props?.markers
				? props.markers
				: [{ title: "General Title", position: { lat: 37.9838, lng: 23.7275 }}];  

		const defaultCenter = props?.defaultCenter ? props.defaultCenter : markerArray[0].position;
		return (
			<GoogleMap
				defaultZoom={13}
				defaultCenter={defaultCenter}
				defaultOptions={{
					scrollwheel: true,
					zoomControl: true,
				}}
				center={defaultCenter}
            >
            {
                markerArray.map((el,index) => { 
					return (<Marker key={`map-marker-${index}`} position={{...el.position}} title={el.title} /> );
				})
            }
			</GoogleMap>
		);
	})
);


export default Map;