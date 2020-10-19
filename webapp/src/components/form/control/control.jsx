import React from "react";
import { Form } from "react-bootstrap";

const FormConrol = ({
	title,
	type,
	name,
	values,
	handleChange,
	readOnly,
	error,
}) => {
	const value = values[name];
	return (
		<>
			<Form.Label>{title}</Form.Label>
			<Form.Control
				as="input"
				type={type}
				value={value}
				onChange={handleChange}
				readOnly={readOnly}
				name={name}
				isInvalid={!!error}
			/>
			<Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
		</>
	);
};

export default FormConrol;
