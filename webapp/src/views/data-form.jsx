import React from "react";
import PropTypes from 'prop-types';
import { Container, Row, Col } from "react-bootstrap";
import { useQuery } from "react-query";

import Form from "../components/form/form.component";

import Loading from "../components/loading/loading.component";

import { getBackEndHost } from '../api/APIUtils';

const BACKEND_HOST = getBackEndHost();

const DataForm = ({ title, table, id, newRec,...props }) => { 
	const url = (newRec)? `${BACKEND_HOST}/api/${table}/init`:`${BACKEND_HOST}/api/${table}/${id}`;
	 
	// const { status, data, error, isFetching } = useQuery([`${url}`]);
	const { data: res, isFetching } = useQuery([`${url}`]);
	if (isFetching) {
		return <Loading />;
	}
	const {data, relData} = res;
	const formData = (data[0])? data[0]:{};
	const formDataId = (formData.id)?  parseInt(formData.id, 10):{};

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
					<Form {...props} table={table} data={formData} id={formDataId} relData={relData} newRec={newRec} />
				</Col>
			</Row>
		</Container>
	);
};

DataForm.propTypes = {
	title: PropTypes.string.isRequired,
	table: PropTypes.string.isRequired,
	newRec: PropTypes.bool.isRequired,
	id: PropTypes.number
};

export default DataForm;
