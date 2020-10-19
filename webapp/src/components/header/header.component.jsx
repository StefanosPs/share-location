import React from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";

import ShareLoc from "../button/share-loc/share-loc.component"

const Header = ({signOut, userObj}) => {

	const fullName = (userObj.fullName)?userObj.fullName:userObj.username;
	return (
		<Navbar bg="dark" variant="dark">
			<Navbar.Brand>React Bootstrap</Navbar.Brand>

			<Navbar.Toggle />

			
			<Navbar.Collapse className="justify-content-end"> 
				<Nav>
					<ShareLoc />
				</Nav>
				<NavDropdown title={fullName} id="basic-nav-dropdown">
					<NavDropdown.Divider />
					<NavDropdown.Item onClick={signOut}>Logout</NavDropdown.Item>
				</NavDropdown>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
