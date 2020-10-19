import React from "react";
import PropTypes from "prop-types";
import { Nav, Navbar, Button } from "react-bootstrap";

// import { VscAdd, VscEdit, VscTrash } from "react-icons/vsc";

const ActionNav = ({ buttons }) => {
	if (!(Array.isArray(buttons) && buttons.length > 0)) {
		return;
	}
	//TODO check permissions
	return (
		<Navbar collapseOnSelect expand="md">
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav text-center">
				<Nav className="ml-auto">
					{buttons.map((el, index) => {
						const title = el.title ? el.title : "";
						const icon = el.icon ? el.icon : "";
						const variant = el.variant ? el.variant : "primary";
						const onClick = el.onClick
							? el.onClick
							: () => {
									alert("onclick");
							  };
						if (!title) {
							return null;
						}

						return (
							<Nav.Item
								key={`action-nav-item-button-${index}`}
								style={{ marginLeft: "1rem" }}
							>
								<Button variant={variant} onClick={onClick}>
									{icon}
									{title}
								</Button>{" "}
							</Nav.Item>
						);
					})}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};
ActionNav.propTypes = {
	insert: PropTypes.func,
	edit: PropTypes.func,
	remove: PropTypes.func,
};

export default ActionNav;

/**
 * 					{typeof insert === "function" && (
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
)}s
 */
