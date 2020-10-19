import React from "react";

import Container from 'react-bootstrap/Container';

import SignIn from "../../components/sign-in/sign-in.component";

const SignInPage = () => (
	<Container className="d-flex h-100" fluid>
			<SignIn></SignIn>
	</Container>
);

export default SignInPage;
