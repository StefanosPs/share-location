import React from "react";
import {
	Container,
	Row,
	Col 
} from "react-bootstrap";
import DataGrid from "../components/data-grid";

const DataList = ({ title, ...props }) => { 

	
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
					<DataGrid {...props} />
				</Col>
			</Row>
		</Container>
	);
};

export default DataList;

/* <Col className="d-none d-md-block " sm={false}>
    <ButtonToolbar className="justify-content-end" aria-label="Toolbar with button groups">
        <ButtonGroup aria-label="First group">
            <Button className="mr-2" >1</Button> <Button className="mr-2" >2</Button>
        </ButtonGroup>
    </ButtonToolbar>
</Col> */
