import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Form, ButtonToolbar, Button, Container, Row, Col } from 'react-bootstrap';

import { fetchJson, getBackEndHost } from '../../api/APIUtils';

import Loading from '../loading/loading.component';
import DisplayError from '../display-error/display-error.component'

import useForm from './form.hook';
import useStructure from './form-structure.hook';
import ActionNav from './form-nav-actions';

import FormConrol from './control/control';
import FormSelect from './control/select/select';

const BACKEND_HOST = getBackEndHost();

const FormMain = ({ table, data, newRec, isReadOnly, relData, actionNav, ...props }) => {


	console.log(`FormMain:: ${isReadOnly} --- `)

	const history = useHistory();
	const { isLoading, fields, validationFields } = useStructure(table);
	const { values, errors, handleChange, handleSubmit } = useForm(
		submitFunction,
		validateFunction,
		data
	);
	const [errorLogService, setErrorLogService] = useState([]);

	async function submitFunction() {
		// console.log("Here");
		// setLogInServiceError('cddcdcd');
		let method = 'POST';
		let url = `${BACKEND_HOST}/api/${table}/`;
		if (!newRec) {
			method = 'PUT';
			url = `${BACKEND_HOST}/api/${table}/${values['id']}`;
		}
		fetchJson(url, {
			method,
			user: {
				authenticated: true
			},
			body: JSON.stringify(values)
		})
			.then(res => {
				// setErrorLogService([]);
				//TODO push

				history.goBack();
			})
			.catch(er => {
				if (er.errors) {
					setErrorLogService(er.errors);
				}
			});
	}

	function validateFunction() {
		let errorAr = {};
		const fieldsToCheck = Object.keys(validationFields);

		fieldsToCheck.forEach(index => {
			const element = validationFields[index];

			if (element.required && !values[index]) {
				errorAr[index] = `${fields[index]['title']} required`;
			}

			if (element.minLength && values[index].length < element.minLength) {
				errorAr[index] = `${fields[index]['title']} length must be more than ${element.minLength} `;
			}

			if (element.maxLength && values[index].length > element.maxLength) {
				errorAr[index] = `${fields[index]['title']} length must be less than ${element.maxLength} `;
			}
		});
		return errorAr;
	}
	if (isLoading) {
		return <Loading />;
	}
	const fieldKeys = Object.keys(fields);
	return (
		<Container fluid>
			<Row>
				<Col>{actionNav && <ActionNav buttons={actionNav} />}</Col>
			</Row>
			<Row>
				<Col>
					<Form onSubmit={handleSubmit} className="data-form">
						{Array.isArray(errorLogService) &&
							errorLogService.length > 0 &&
							errorLogService.map(el => (
								<DisplayError>
									{el.message}
								</DisplayError>
							))}
						{fieldKeys.map(index => {
							const el = fields[index];

							return (
								<Form.Group key={el.dataField} controlId={`form-group-${el.dataField}`}>
									{(inputType => {
										switch (inputType) {
											case 'select':
												return (
													<FormSelect
														element={el}
														title={el.title}
														type={el.inputType}
														name={el.dataField}
														values={values}
														handleChange={handleChange}
														readOnly={isReadOnly? isReadOnly :  newRec ? !!el.readOnlyNewRec : !!el.readOnly}
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
														readOnly={isReadOnly? isReadOnly : newRec ? !!el.readOnlyNewRec : !!el.readOnly}
														error={errors[el.dataField]}
													/>
												);
										}
									})(el.inputType)}
								</Form.Group>
							);
						})}

						<ButtonToolbar>
							{!isReadOnly && <Button variant="primary" type="submit">
								Submit
							</Button>}
							<Button
								variant="danger"
								className="float-right ml-auto"
								type="submit"
								onClick={e => {
									e.preventDefault();
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
FormMain.defaultProps = {
	isReadOnly: false
}
FormMain.propTypes = {
	data: PropTypes.object.isRequired,
	newRec: PropTypes.bool.isRequired,
	isReadOnly: PropTypes.bool,
	relData: PropTypes.objectOf(PropTypes.array),
	actionNav: PropTypes.arrayOf(PropTypes.object),
};

export default FormMain;
