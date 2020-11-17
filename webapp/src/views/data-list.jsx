import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import { PermissionDataGridConsumer } from '../components/permission/permission.component';
import DataGrid from '../components/data-grid';

const DataList = ({ title, refTable, refId, table, ...props }) => {
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
					<PermissionDataGridConsumer table={table} >
						<DataGrid table={table} refTable={refTable} refId={refId} {...props} />
					</PermissionDataGridConsumer>
				</Col>
			</Row>
		</Container>
	);
};

DataList.propTypes = {
	title: PropTypes.string.isRequired,
	table: PropTypes.string.isRequired,
	refTable: PropTypes.string,
	refId: PropTypes.number
};

export default DataList;
