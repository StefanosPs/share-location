import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import mapboxgl, { Marker, Popup } from 'mapbox-gl';
import './map.css';

import { useShareLoc } from '../share-loc/share-loc.component';

import { fetchJson, getBackEndHost } from '../../api/APIUtils';

mapboxgl.accessToken = process.env.REACT_APP_MAPS_KEY;

const BACKEND_HOST = getBackEndHost();

let controllerMarkers = null;

const Map = ({ markers, defaultCenter, ...props }) => {
	const center = defaultCenter ? defaultCenter : markers[0];

	const shareLoc = useShareLoc();
	const mapContainerRef = useRef(null);
	const [map, setMap] = useState(null);
	const [markersObj, setMarkersObj] = useState();

	const [mapPrpObj, setMapPrpObj] = useState({
		userId: center.id,
		lng: center.position.lng.toFixed(4),
		lat: center.position.lat.toFixed(4),
		zoom: 13
	});

	const lastMarkUpdate = shareLoc.getLastMarkUpdate();

	useEffect(() => {
		try {
			const markersObj = {};
			const map = new mapboxgl.Map({
				container: mapContainerRef.current,
				style: 'mapbox://styles/mapbox/streets-v11',
				center: [mapPrpObj.lng, mapPrpObj.lat],
				zoom: mapPrpObj.zoom,
				draggable: true
			});
	
			// Add navigation control (the +/- zoom buttons)
			map.addControl(new mapboxgl.NavigationControl(), 'top-right');
	
			map.on('move', () => {
				setMapPrpObj(prv => ({
					...prv,
					lng: map.getCenter().lng.toFixed(4),
					lat: map.getCenter().lat.toFixed(4),
					zoom: map.getZoom().toFixed(2)
				}));
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
		} catch (e) {

		}

		return () => {
			if(map) map.remove()
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const lat = +defaultCenter.position.lat;
		const lng = +defaultCenter.position.lng;
		if (isNaN(lat) || isNaN(lng) || map === null) {
			return;
		}
		map.flyTo({
			center: [lng, lat]
		});

		setMapPrpObj(prv => ({
			...prv,
			userId: defaultCenter.id,
			lng: lng.toFixed(4),
			lat: lat.toFixed(4)
		}));
	}, [defaultCenter, map]);

	useEffect(() => {
		const fetchMarks = async timestamp => {
			if (timestamp === 0) {
				return;
			}
			//var signal = controllerMarkers.signal;
			try {
				if (controllerMarkers) {
					controllerMarkers.abort();
				}

				controllerMarkers = new AbortController();
				const { data } = await fetchJson(`${BACKEND_HOST}/api/mark/?timespamp=${timestamp}`, {
					user: {
						authenticated: true
					},
					signal: controllerMarkers.signal
				});
				for (let index = 0; index < data.length; index++) {
					const el = data[index];
					const lat = +el.position.lat;
					const lng = +el.position.lng;

					if (isNaN(lat) || isNaN(lng)) return;

					markersObj[el.userId].setLngLat([lng, lat]);
					markersObj[el.userId].addTo(map);

					if (
						el.userId === mapPrpObj.userId &&
						(lng.toFixed(4) !== mapPrpObj.lng || lng.toFixed(4) !== mapPrpObj.lng)
					) {
						map.flyTo({
							center: [lng, lat]
						});

						setMapPrpObj(prv => ({
							...prv,
							lng: lng.toFixed(4),
							lat: lat.toFixed(4)
						}));
					}
				}
			} catch (error) {
				console.error(error);
			}
		};
		if (map && markersObj) {
			fetchMarks(+lastMarkUpdate.timestamp);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lastMarkUpdate, map, markersObj]);

	return (
		<div>
			<div className="sidebarStyle">
				<div>
					Longitude: {mapPrpObj.lng} | Latitude: {mapPrpObj.lat} | Zoom: {mapPrpObj.zoom}
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
	defaultCenter: PropTypes.exact({
		userId: PropTypes.number,
		title:  PropTypes.string,
		position: PropTypes.exact({
			lng: PropTypes.number,
			lat: PropTypes.number
		})
	})
};

export default Map;
