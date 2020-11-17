import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Form } from 'react-bootstrap';

import { useQuery } from 'react-query';

import { getBackEndHost } from '../api/APIUtils';

import { useAuth } from "../components/auth/auth.component";
import Map from '../components/map/map.component';
import Loading from '../components/loading/loading.component';


const BACKEND_HOST = getBackEndHost();

const userToMarker = {};

const MapsView = ({ ...prop }) => {
	const history = useHistory();
	const auth = useAuth();
	const historyParams = history?.location?.state?.dataGrid
		? { ...history.location.state.dataGrid }
		: {}; 

	const [mapData, setMapData] = useState({
		selected: auth.user.key,
		...historyParams
	});


	const { data: res, isFetching } = useQuery([`${BACKEND_HOST}/api/mark/`]);

	if (isFetching || !res) {
		return <Loading />;
	}

	const { data, relData } = res;
	const users = relData.user.reduce((result, currentValue) => {
		result[currentValue.id] = currentValue.fullName;
		return result;
	}, {});

	
	const markers = data.map((element, index) => { 
		userToMarker[element.userId] = index;
		return {
			userId: element.userId,
			title: users[element.userId],
			position: {lng: +element.position.lng, lat: +element.position.lat }
		};
	});
 

	const handleChange = event => {
		event.persist();
		console.log(`event.target.value = ${event.target.value}`);
		setMapData(values => ({
			...values,
			selected: event.target.value
		}));
	};

	return (
		<Container fluid className="px-md-0">
			<Row className="border-bottom">
				<Col className="align-text-bottom">
					<Form inline>
						<Form.Group controlId={`form-group-select-mark`}>
							<Form.Label>Select Mark: </Form.Label>
							<Form.Control
								as={'select'}
								type={'select'}
								value={mapData.selected}
								onChange={handleChange}
								name={'mark'}
								className="ml-1"
							>
								{markers.map((el, index) => {
									return (
										<option key={`optkey-${el.userId}`} value={el.userId}>
											{el.title}
										</option>
									);
								})}
							</Form.Control>
						</Form.Group>
					</Form>
				</Col>
			</Row>
			<Row>
				<Col>
					<Map
						loadingElement={<div style={{ height: `100%` }} />}
						containerElement={<div className="map-container" />}
						mapElement={<div style={{ height: `100%` }} />}
						markers={markers}
						defaultCenter={markers[userToMarker[mapData.selected]]}
					/>
				</Col>
			</Row>
		</Container>
	);
};

export default MapsView;
