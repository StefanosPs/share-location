import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import mapboxgl, { Marker, Popup } from 'mapbox-gl';
import "./map.css";

import { useShareLoc } from '../share-loc/share-loc.component';

import { fetchJson, getBackEndHost } from '../../api/APIUtils';

mapboxgl.accessToken =
	'pk.eyJ1Ijoic3RlcHNhcnJhcyIsImEiOiJja2hkaTE5OXUwNTAzMnJrOTExN2Q0cmh2In0.ElEZCUaUxKjz4FygcOpreQ';

const BACKEND_HOST = getBackEndHost();


let controllerMarkers = null;

const Map = ({ markers, defaultCenter, ...props }) => {
	const center = defaultCenter ? defaultCenter : markers[0].position;
	const shareLoc = useShareLoc();
	const mapContainerRef = useRef(null);
	const [map, setMap] = useState(null);
	const [markersObj, setMarkersObj] = useState();

	const [lng, setLng] = useState(center.lng);
	const [lat, setLat] = useState(center.lat);
	const [zoom, setZoom] = useState(7);

	const lastMarkUpdate = shareLoc.getLastMarkUpdate();

	useEffect(() => {
		const markersObj = {};
		const map = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom,
			draggable: true
		});

		// Add navigation control (the +/- zoom buttons)
		map.addControl(new mapboxgl.NavigationControl(), 'top-right');

		map.on('move', () => {
			setLng(map.getCenter().lng.toFixed(4));
			setLat(map.getCenter().lat.toFixed(4));
			setZoom(map.getZoom().toFixed(2));
		});

		for (let index = 0; index < markers.length; index++) {
			const el = markers[index];
			const lat = +el.position.lat;
			const lng = +el.position.lng;

			if (isNaN(lat) || isNaN(lng)) {
				continue;
			}

			const popup = new Popup({ offset: 25 }).setText(`Title: ${el.title}.`);

			markersObj[el.id] = new Marker()
				.setLngLat([lng, lat])
				.setPopup(popup)
				.addTo(map);
		}

		// Clean up on unmount
		setMap(map);
		setMarkersObj(markersObj);
		return () => map.remove();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const lat = +defaultCenter.lat;
		const lng = +defaultCenter.lng;
		if (isNaN(lat) || isNaN(lng) || map === null) {
			return;
		}
		map.flyTo({
			center: [lng, lat]
		});

		setLng(lng);
		setLat(lat);
	}, [defaultCenter, map]);


	useEffect(() => {
		const fetchMarks = async timestamp => {
			if (timestamp === 0) {
				return;
			}
			//var signal = controllerMarkers.signal;
			try {
				if(controllerMarkers){
					controllerMarkers.abort();
				}

				controllerMarkers = new AbortController();
				const { data } = await fetchJson(`${BACKEND_HOST}/api/mark/?timespamp=${timestamp}`, {
					user: {
						authenticated: true
					},
					signal:  controllerMarkers.signal
				});
				for (let index = 0; index < data.length; index++) {
					const el = data[index];
					const lat = +el.position.lat;
					const lng = +el.position.lng;

					if (isNaN(lat) || isNaN(lng)) return;

					markersObj[el.userId].setLngLat([lng, lat]);
					markersObj[el.userId].addTo(map);
				}
			} catch (error) {
				console.error(error);
			}
		};
		if( map && markersObj ){
			fetchMarks(+lastMarkUpdate.timestamp);
		}
	}, [lastMarkUpdate, map, markersObj]);

	return (
		<div>
			<div className="sidebarStyle">
				<div>
					Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
				</div>
			</div>
			<div className="map-container" ref={mapContainerRef} />
		</div>
	);
};

Map.defaultProps = {
	markers: [{ id: 0, title: 'General Title', position: { lat: 37.9838, lng: 23.7275 } }]
};

Map.propTypes = {
	markers: PropTypes.arrayOf(PropTypes.object),
	defaultCenter: PropTypes.object
};

export default Map;
