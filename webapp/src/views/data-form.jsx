import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuery } from 'react-query';

import { PermissionFormConsumer } from '../components/permission/permission.component';
import Form from '../components/form/form.component';

import Loading from '../components/loading/loading.component';

import { getBackEndHost } from '../api/APIUtils';

const BACKEND_HOST = getBackEndHost();

const DataForm = ({ title, table, id, newRec, isReadOnly, ...props }) => {
	const url = newRec ? `${BACKEND_HOST}/api/${table}/init` : `${BACKEND_HOST}/api/${table}/${id}`;
	// const { status, data, error, isFetching } = useQuery([`${url}`]);
	const { data: res, isFetching } = useQuery([`${url}`]);
	if (isFetching) {
		return <Loading />;
	}
	const { data, relData } = res;
	const formData = data[0] ? data[0] : {};
	const formDataId = formData.id ? parseInt(formData.id, 10) : {};

	//TODO Add columns, Title and action Request
	return (
		<Container fluid className="px-md-4">
			<Row className="border-bottom">
				<Col className="align-text-bottom">
					<h2>{title}</h2>
				</Col>
			</Row>
			<Row>
				<Col>
					<PermissionFormConsumer table={table} newRec={newRec}>
						<Form
							{...props}
							table={table}
							data={formData}
							id={formDataId}
							relData={relData}
							newRec={newRec}
							isReadOnly={isReadOnly}
						/>
					</PermissionFormConsumer>
				</Col>
			</Row>
		</Container>
	);
};
DataForm.defaultProps = {
	isReadOnly: false
}
DataForm.propTypes = {
	title: PropTypes.string.isRequired,
	table: PropTypes.string.isRequired,
	newRec: PropTypes.bool.isRequired,
	isReadOnly: PropTypes.bool,
	id: PropTypes.number
};

export default DataForm;
