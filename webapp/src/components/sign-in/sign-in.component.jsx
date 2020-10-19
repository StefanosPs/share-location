import React from "react";
import { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";

import useForm from "../form/form.hook";
import { useAuth } from "../auth/auth.component";

import "./sign-in.styles.scss";


function validate(values) {
	let errors = {};
	if (!values.username) {
		errors.username = "Username is required";
	}
	if (!values.password) {
		errors.password = "Password is required";
	} else if (values.password < 5 || values.password > 15) {
		errors.password = "Password must be between 5 and 15 characters";
	} else if (values.password.search(/[0-9]/g) === -1) {
		errors.password = "Password must contains at least one number";
	} else if (values.password.search(/[a-zA-Z]/g) === -1) {
		errors.password = "Password must contains at least one character";
	} 
	return errors;
}
export default function SignIn() {
	const [logInServiceError, setLogInServiceError] = useState({message:'',errors:{}}); 
	

	const { values, errors, handleChange, handleSubmit } = useForm(
		login,
		validate,
		{ username: "", password: "" },
		{...logInServiceError.errors}
	);
	const auth = useAuth();
	

	async function login() {
		// console.log(`No errors, submit callback called! with params`, values);
		try {
			await auth.signIn({username : values.username, password: values.password});
		} catch (error) {
			setLogInServiceError({...{
				message: error.message.toString(),
				errors: (error.getErrorsObj) ? error.getErrorsObj(): {}
		}});
		}
	}

	return (
		<Form onSubmit={handleSubmit} className="form-signin">
			{logInServiceError.message ? (
				<Alert variant="danger" dismissible>
					{logInServiceError.message}
				</Alert>
			) : (
				""
			)}
			<Form.Group controlId="formBasicUserName">
				<Form.Label>User Name</Form.Label>
				<Form.Control
					onChange={handleChange}
					name="username"
					value={values.username}
					type="text"
					isInvalid={!!errors.username || !!logInServiceError.errors.username}
					placeholder="Enter the username"
				/>
				<Form.Control.Feedback type="invalid">
					{errors.username}
					{logInServiceError.errors.username}
				</Form.Control.Feedback>
			</Form.Group>

			<Form.Group controlId="formBasicPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control
					type="password"
					onChange={handleChange}
					name="password"
					value={values.password}
					isInvalid={!!errors.password || !!logInServiceError.errors.password}
					placeholder="Password"
				/>
				<Form.Control.Feedback type="invalid">
					{errors.password}
					{logInServiceError.errors.password}
				</Form.Control.Feedback>
			</Form.Group>
			{false && <Form.Group controlId="formBasicCheckbox">
				<Form.Check type="checkbox" label="Check me out" />
			</Form.Group>}
			<Button variant="primary" type="submit">
				Submit
			</Button>
		</Form>
	);
}
