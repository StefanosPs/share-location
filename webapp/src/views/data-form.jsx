import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useQuery } from "react-query";

import Form from "../components/form/form.component";
// import useStructure from "../components/form/form-structure.hook";
import Loading from "../components/loading/loading.component";

const BACKEND_HOST = (process.env.REACT_APP_BACKEND_PROTOCOL || 'http') + '://'+ (process.env.REACT_APP_BACKEND_HOST || window.document.location.hostname) + ((process.env.REACT_APP_BACKEND_PORT)? `:${process.env.REACT_APP_BACKEND_PORT}` : '' ) ;

const DataForm = ({ title, table, ...props }) => {
	const id = (props.match.params.id)? parseInt(props.match.params.id, 10):0;
	const newRec = (id)? false:true;
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

export default DataForm;
