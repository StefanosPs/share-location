import React from "react";
import PropTypes from "prop-types";
import {
	Nav,
	Navbar,
	Button,
} from "react-bootstrap";

import { VscAdd, VscEdit, VscTrash } from "react-icons/vsc";

const ActionNav = ({  insert, update, remove }) => {
	//TODO check permissions
	return (
		<>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav text-center">
				<Nav className="ml-auto">
					{typeof insert === "function" && (
						<Nav.Item >
							<Button variant="primary" onClick={insert}>
								<VscAdd size={16} />
								Add
							</Button>
						</Nav.Item>
					)}
					{typeof update === "function" && (
						<Nav.Item >
							<Button variant="secondary" onClick={update}>
								<VscEdit size={16} />
								Edit
							</Button>
						</Nav.Item>
					)}
					{typeof remove === "function" && (
						<Nav.Item >
							<Button variant="danger" onClick={remove}>
								<VscTrash size={16} />
								Delete
							</Button>
						</Nav.Item>
					)}
				</Nav>
			</Navbar.Collapse>
		</>
	);
};
ActionNav.propTypes = {
	insert: PropTypes.func,
	edit: PropTypes.func,
	remove: PropTypes.func,
};

export default ActionNav;