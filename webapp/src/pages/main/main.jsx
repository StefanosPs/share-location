import React from "react";

import { Container, Row } from "react-bootstrap";
import { Route, Switch, Redirect } from "react-router-dom";

import { useAuth } from "../../components/auth/auth.component";
import { ProvideShareLoc } from "../../components/share-loc/share-loc.component"

import Header from "../../components/header/header.component";
import SlideBar from "../../components/slide-bar/slide-bar.component";

import SignInPage from "../sign-in/sign-in";
import { routes } from "./routes.data";
 

const getRoutes = (key, routes, href) => {
	if (!href) {
		href = "";
	}
	if (routes.path) {
		href += routes.path;
	}

	let retArr = [];

	if (!key) {
		key = "route";
	}

	if (routes.isLink) {
		if (routes.isBasicRedirect) {
			retArr.push(
				<Redirect
					exact
					key={`redirect-${key}`}
					from="/"
					to={`${href}`}
					component={(props) => {
						return <routes.component {...props} />;
					}}
				/>
			); 
		}else{
			retArr.push(
				<Route
					key={key}
					path={`${href}`}
					render={(props) => {
						return <routes.component {...props} />;
					}}
				/>
			);
		}

	}
	if (routes.nodes) {
		for (const property in routes.nodes) {
			const tmpAr = getRoutes(property, routes.nodes[property], `${href}`);
			retArr = [...tmpAr, ...retArr];
		}
	}
	return retArr;
};

const MainPage = (props) => {
	const auth = useAuth();
 
	if (!auth.user) {
		return <SignInPage />;
	}

	return ( 
		<ProvideShareLoc>
			<Container fluid>
				<Row>
					<SlideBar items={routes} location={props.location.pathname} />
					<main className="">
						<Header signOut={auth.signOut} userObj={auth.user} />
						<Switch>{getRoutes("", routes, "")}</Switch>
					</main>
				</Row>
			</Container>
		</ProvideShareLoc>
	);
};

export default MainPage;
