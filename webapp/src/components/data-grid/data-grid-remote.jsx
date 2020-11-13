import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import { Container, Row, Col, Navbar, Form, Table, Alert } from "react-bootstrap";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
// import cellEditFactory from "react-bootstrap-table2-editor";
// import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import filterFactory from "react-bootstrap-table2-filter";

import { useQuery } from "react-query";

import { fetchJson, getBackEndHost } from "../../api/APIUtils";

import useStructure from "./data-grid-structure.hook";

import Loading from "../../components/loading/loading.component";
import ActionNav from "./data-grid-nav-actions";

// const cellEditProps = {
// 	mode: "click",
// };
const defaultSelectRow = {
	mode: "radio",
	clickToSelect: true,
};

const { SearchBar } = Search;

const BACKEND_HOST = getBackEndHost();

/* <Container fluid="xl" className="data-grid">
	<Row>
		<Col>
		</Col>
	</Row>
</Container> */
const RemoteAll = ({ columns, defaultSorted, refTable, refId, table, filter }) => { 

	const history = useHistory();
	const dataUrl = (refId)? `${BACKEND_HOST}/api/${refTable}/${refId}/${table}/`:`${BACKEND_HOST}/api/${table}/`;
	// const dataUrl = (refTable && match && match.params.refId)? `${BACKEND_HOST}/api/${refTable}/${match.params.refId}/${table}/`:`${BACKEND_HOST}/api/${table}/`;
	const {location} = history;

	const historyParams =  (
		history?.location?.state?.dataGrid
	) ?
		{ ...history.location.state.dataGrid }:{};


	const useQueryParams = {};
	if (defaultSorted) {
		useQueryParams["sortField"] = [];
		useQueryParams["sortOrder"] = [];

		for (const iterator of defaultSorted) {
			useQueryParams["sortField"].push(iterator.dataField);
			useQueryParams["sortOrder"].push(iterator.order);
		}
	}
	// console.log(history);
	const [gridData, setGridData] = useState({
		page: 1,
		sizePerPage: 10,
		selectedRecID: 0,
		loading: false,
		filter,
		...historyParams,
		...useQueryParams,
	});

	const { data: res, error, isFetching, clear } = useQuery([
		dataUrl,
		{
			page: gridData.page,
			sizePerPage: gridData.sizePerPage,
			sortField: gridData.sortField,
			sortOrder: gridData.sortOrder,
			filter: gridData.filter
		},
	]);
	
	if(error){ 
		return <Alert variant="danger" dismissible>{error}</Alert>;
	}

	if (isFetching || gridData.loading) {
		return <Loading />;
	}

	const { data, meta, relData } = res;

	columns.forEach(element => {
		if(element?.formatterRelData?.table && relData  && relData[element.formatterRelData.table]){ 
			element.formatExtraData = relData[element.formatterRelData.table].reduce((result, currentValue) => {
				result[currentValue[element.formatterRelData.keyField ]] = currentValue[element.formatterRelData.valueField];
				return result;
			}, {});
			element.formatter = (cell, row, rowIndex, formatExtraData) => {
				return (formatExtraData[cell]);
			}
		}
	});

	const onSizePerPageChange = (sizePerPage, page) => {
		let urlParams = "?";
		if (urlParams) {
			urlParams += new URLSearchParams({
				page,
				sizePerPage,
			});
		}

		history.push(
			{
				pathname: location.pathname,
				search: urlParams,
			},
			{
				dataGrid: {
					page,
					sizePerPage,
				},
			}
		);
		//
		setGridData(prevState => {
			// Object.assign would also work
			return {...prevState,  page, sizePerPage};
		  });

		
	};

	const onPageChange = (page, sizePerPage) => {


		let urlParams = "?";
		if (urlParams) {
			urlParams += new URLSearchParams({
				page,
				sizePerPage,
			});
		}

		history.push(
			{
				pathname: location.pathname,
				search: urlParams,
			},
			{
				dataGrid: {
					page,
					sizePerPage,
				},
			}
		);
		setGridData(prevState => {
			// Object.assign would also work
			return {...prevState,  page, sizePerPage};
		  });
	};

	const onTableChange = (type, params) => {
		/* if (sortOrder === 'asc') {
			result = data.sort((a, b) => {
			  if (a[sortField] > b[sortField]) {
				return 1;
			  } else if (b[sortField] > a[sortField]) {
				return -1;
			  }
			  return 0;
			});
		  } else {
			result = data.sort((a, b) => {
			  if (a[sortField] > b[sortField]) {
				return -1;
			  } else if (b[sortField] > a[sortField]) {
				return 1;
			  }
			  return 0;
			});
		  }  */
	};

	const onSelectRow = (row, isSelect) => {
		const id = row.id;
		if (id) {
			setGridData(prevState => {
				// Object.assign would also work
				return {...prevState, selectedRecID: id};
			});
		}
	};

	const insertFn = () => {
		if (!location.pathname) {
			throw new Error("Underfunded path name");
		}
		history.push(`${location.pathname}/new`);
	};
	const updateFn = () => {
		if (!location.pathname) {
			throw new Error("Underfunded path name");
		}
		if (!gridData.selectedRecID) {
			throw new Error("Please select rec");
		}

		history.push(`${location.pathname}/${gridData.selectedRecID}`);
	};
	const removeFn = () => {
		if (!gridData.selectedRecID) {
			throw new Error("Please select rec");
		}
 
		setGridData(prevState => {
			// Object.assign would also work
			return {...prevState,  loading: true };
		});

		// const BACKEND_HOST = process.env.REACT_APP_BACKEND_HOST || "localhost";
		let url = `${BACKEND_HOST}/api/${table}/${gridData.selectedRecID}`;
		fetchJson(url, {
				method: "DELETE",
				user: {
					authenticated: true,
				},
			})
			.then((res) => {
				console.log(data);
				let page = gridData.page;
				if (data.length === 1) {
					page--;
				}
				clear();
				setGridData({ ...gridData, page, loading: false, selectedRecID: 0 });
			})
			.catch((er) => {
				setGridData({ ...gridData, loading: false });
			});
	};

	

	return (
		<ToolkitProvider keyField="id" data={data} columns={columns} search>
			{(toolkitprops) => (
				<div className="data-grid">
					<Navbar collapseOnSelect expand="md">
						<Form inline>
							<div style={{ padding: "0.5rem 1rem" }}>
								<SearchBar {...toolkitprops.searchProps} />
							</div>
						</Form>

						<ActionNav insert={insertFn} update={updateFn} remove={removeFn} />
					</Navbar>
					<BootstrapTable
						as={Table}
						striped
						bordered
						hover
						{...toolkitprops.baseProps}
						onTableChange={onTableChange}
						// cellEdit={cellEditFactory(cellEditProps)}
						selectRow={{
							...defaultSelectRow,
							selected: [gridData.selectedRecID],
							onSelect: onSelectRow,
						}}
						remote={{ filter: true, pagination: true, sort: true }}
						defaultSorted={defaultSorted}
						filter={filterFactory()}
						pagination={paginationFactory({
							page: gridData.page,
							sizePerPage: gridData.sizePerPage,
							totalSize: (meta && meta.totalCount)? meta.totalCount : 0,
							onSizePerPageChange,
							onPageChange,
						})}
					/>
				</div>
			)}
		</ToolkitProvider>
	);
};

RemoteAll.propTypes = {
	columns: PropTypes.array.isRequired,
	defaultSorted: PropTypes.array.isRequired,
	table: PropTypes.string.isRequired, 
	filter:  PropTypes.shape({
		and: PropTypes.array,
		or: PropTypes.array
	})
};

export const DataGrid = ({ refTable, refId, table ,  ...props }) => {
	const { isLoading, columns, sorted } = useStructure(table);

	if (isLoading) {
		return <Loading />;
	}

	if (!columns || columns.length < 1) {
		return <h6>Columns Error</h6>;
	}
	//TODO Add pemission check for table ( new request )
	return (
		<Container fluid>
			<Row>
				<Col>
					<RemoteAll
						columns={columns}
						defaultSorted={sorted}
						refTable={refTable}
						refId={refId}
						table={table} 
						{...props}
					/>
				</Col>
			</Row>
		</Container>
	);
};
DataGrid.propTypes = { 
	refTable: PropTypes.string,
	refId: PropTypes.number,
	table: PropTypes.string.isRequired
};