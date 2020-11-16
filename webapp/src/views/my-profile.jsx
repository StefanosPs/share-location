import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from "react-bootstrap";

import DataForm from './data-form';
import DataList from './data-list';
import { useAuth } from '../components/auth/auth.component';

const MyProfile = ({ title, ...props }) => {
	const {user} = useAuth(); 
	return (
		<Container fluid className="px-md-4">
			<Row >
				<Col xs={12} lg={6}>
					<DataForm title={title} table="user" id={user.key} newRec={false} {...props} />
				</Col>
				<Col xs={12} lg={6}> 
					<Container>
						<Row>
							<Col>
								<DataList title={`Active Connections`} refTable="user" refId={user.key} table="connections" filters={{
									'and': [
										{'status': {'eq' : 'ACTIVE'}}
									]
								}} {...props}   />
							</Col>
						</Row> 
						<Row>
							<Col>
								<DataList title={`Pedding Connections`} refTable="user" refId={user.key} table="connections" filters={{
									'and': [
										{'status': {'eq' : 'PEDDING'}}
									]
								}}  {...props}   />
							</Col>
						</Row> 
					</Container>
				</Col>
			</Row>
		</Container>
	);
};
MyProfile.propTypes = {
	title: PropTypes.string.isRequired
};
export default MyProfile;
