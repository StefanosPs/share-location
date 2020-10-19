import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	Form,
	Alert,
	ButtonToolbar,
	Button,
	Container,
	Row,
	Col,
} from "react-bootstrap";

import fetchUtils from "../../api/APIUtils";

import Loading from "../loading/loading.component";

import useForm from "./form.hook";
import useStructure from "./form-structure.hook";
import ActionNav from "./form-nav-actions";

import FormConrol from "./control/control";
import FormSelect from "./control/select/select";

/**
 * <input type="button">
<input type="checkbox">
<input type="color">
<input type="date">
<input type="datetime-local">
<input type="email">
<input type="file">
<input type="hidden">
<input type="image">
<input type="month">
<input type="number">
<input type="password">
<input type="radio">
<input type="range">
<input type="reset">
<input type="search">
<input type="submit">
<input type="tel">
<input type="text">
<input type="time">
<input type="url">
<input type="week">
 */

/**
<Navbar collapseOnSelect expand="md">
						<Form inline>
							<div style={{ padding: "0.5rem 1rem" }}>
								<SearchBar {...toolkitprops.searchProps} />
							</div>
						</Form>

						<ActionNav insert={insertFn} update={updateFn} remove={removeFn} />
					</Navbar>
  */
const BACKEND_HOST =
	(process.env.REACT_APP_BACKEND_PROTOCOL || "http") +
	"://" +
	(process.env.REACT_APP_BACKEND_HOST || window.document.location.hostname) +
	(process.env.REACT_APP_BACKEND_PORT
		? `:${process.env.REACT_APP_BACKEND_PORT}`
		: "");

const DataForm = ({ table, data, newRec, relData, ...props }) => {
	const history = useHistory();
	const location = history.location;
	const { isLoading, fields, validationFields } = useStructure(table);
	const { values, errors, handleChange, handleSubmit } = useForm(
		submitFunction,
		validateFunction,
		data
	);
	const [errorLogService, setErrorLogService] = useState([]);

	if (isLoading) {
		return <Loading />;
	}

	async function submitFunction() {
		// console.log("Here");
		// setLogInServiceError('cddcdcd');
		let method = "POST";
		let url = `${BACKEND_HOST}/api/${table}/`;
		if (!newRec) {
			method = "PUT";
			url = `${BACKEND_HOST}/api/${table}/${values["id"]}`;
		}
		fetchUtils
			.fetchJson(url, {
				method,
				user: {
					authenticated: true,
				},
				body: JSON.stringify(values),
			})
			.then((res) => {
				// setErrorLogService([]);
				//TODO push

				history.goBack();
			})
			.catch((er) => {
				if (er.errors) {
					setErrorLogService(er.errors);
				}
			});
	}

	function validateFunction() {
		let errorAr = {};
		const fieldsToCheck = Object.keys(validationFields);

		fieldsToCheck.forEach((index) => {
			const element = validationFields[index];

			if (element.required && !values[index]) {
				errorAr[index] = `${fields[index]["title"]} required`;
			}

			if (element.minLength && values[index].length < element.minLength) {
				errorAr[
					index
				] = `${fields[index]["title"]} length must be more than ${element.minLength} `;
			}

			if (element.maxLength && values[index].length > element.maxLength) {
				errorAr[
					index
				] = `${fields[index]["title"]} length must be less than ${element.maxLength} `;
			}
		});
		return errorAr;
	}
	const fieldKeys = Object.keys(fields);
	return (
		<Container fluid>
			<Row>
				<Col>
					<ActionNav
						buttons={[
							{
								title: `Connections`,
								icon: null,
								variant: "info",
								onClick: () => {
									//TODO alert chanches will be lost
									console.log(location.pathname);
									const url = `${location.pathname}/connections`;
									history.push({
										pathname: url,
									});
								},
							},
						]}
					/>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form onSubmit={handleSubmit} className="data-form">
						{Array.isArray(errorLogService) &&
							errorLogService.length > 0 &&
							errorLogService.map((el) => (
								<Alert variant="danger" dismissible>
									{el.message}
								</Alert>
							))}
						{fieldKeys.map((index) => {
							const el = fields[index];
 
							return (
								<Form.Group
									key={el.dataField}
									controlId={`form-group-${el.dataField}`}
								>
									{((inputType) => {
										switch (inputType) {
											case "select":
												return (
													<FormSelect
														element={el}
														title={el.title}
														type={el.inputType}
														name={el.dataField}
														values={values}
														handleChange={handleChange}
														readOnly={
															newRec ? !!el.readOnlyNewRec : !!el.readOnly
														}
														error={errors[el.dataField]}
														relData={relData}
													/>
												);
											default:
												return (
													<FormConrol
														title={el.title}
														type={el.inputType}
														name={el.dataField}
														values={values}
														handleChange={handleChange}
														readOnly={
															newRec ? !!el.readOnlyNewRec : !!el.readOnly
														}
														error={errors[el.dataField]}
													/>
												);
										}
									})(el.inputType)}
								</Form.Group>
							);
						})}

						<ButtonToolbar>
							<Button variant="primary" type="submit">
								Submit
							</Button>
							<Button
								variant="danger"
								className="float-right ml-auto"
								type="submit"
								onClick={() => {
									history.goBack();
								}}
							>
								Close
							</Button>
						</ButtonToolbar>
					</Form>
				</Col>
			</Row>
		</Container>
	);
};

export default DataForm;
