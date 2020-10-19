import React, { useState, useEffect } from "react";
import {
	Nav,
	Accordion,
	// Collapse,
	// Dropdown,
	// ListGroup,
	// Card,
	// Tab,
} from "react-bootstrap";
import { useHistory } from "react-router-dom"; 

import "./slide-bar.styles.scss";

const classNameShow = "sidebar-show";

// let activeAccordion = "";
// let locationPath = "";

const printAccordion = (accordion, key, item, href = "", activeKeys = [], navLinkOnSelect) => {
	if (typeof item !== "object") {
		return "";
	}

	if (!key) {
		key = "route";
	}
	if (item.path) {
		href += item.path;
	}

	if (!item.nodes) {
		if (item.displayAtSlidebar) { 
			const isActive = activeKeys[1] === key  ? true : false; 
			 
			return (
				<Nav.Item as={"li"} key={`Nav.Item-${key}`} >
					<Nav.Link
						
						// as={Link}
						eventKey={[accordion, key,href ]}
						onSelect={navLinkOnSelect}
						active={isActive}
					>
						{item.icon ? <i className={item.icon} /> : ""}
						{item.name}
					</Nav.Link>
				</Nav.Item>
			);
		} else {
			return;
		}
	}

	const tmpKeys = Object.keys(item.nodes);
	const menuItems = Object.values(item.nodes).map((value, id) => {
		return printAccordion(
			`${key}`,
			`${key}${tmpKeys[id]}`,
			value,
			href,
			activeKeys,
			navLinkOnSelect
		);
	});
	if (!item.name) {
		return menuItems;
	} else {
		const isActive = activeKeys[0] === key ? true : false; 
		return (
			<React.Fragment key={key}>
				<Accordion.Toggle as={Nav.Link} variant="link" eventKey={`acc-${key}`} >
					{item.name}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={`acc-${key}`} className={isActive?"show":""} >
					<Nav
						as="ul"
						variant="pills"
						className="flex-column"
						key={`nav-${key}`}
					>
						{menuItems}
					</Nav>
				</Accordion.Collapse>
			</React.Fragment>
		);
	}
};

export default function SideBar({ items, title, location }) {
	const history = useHistory();
	
	let historyParams = [];
	if (history && history.location && history.location.state  && history.location.state.sideBar) {
		historyParams = [ ...history.location.state.sideBar ];
	}

	const [key, setKey] = useState(historyParams); 
	const isOpen = () => {
		let el = document.getElementById("root");
		if (el && el.classList) {
			return el.classList.contains(classNameShow);
		}

		return false;
	};

	const toggleSlideBar = () => {
		let el = document.getElementById("root");
		if (el) {
			el.classList.toggle(classNameShow);
		}
	};

	const navLinkOnSelect = (eventKey, event) => {  
		
		const keys = eventKey.split(","); 
		setKey([keys[0], keys[1]]); 
		
		history.push(
			{
				pathname: keys[2]
			},
			{
				sideBar:[keys[0], keys[1]]
			}
		);
	};

	useEffect(() => {
		if (!isOpen()) {
			toggleSlideBar();
		}

		return () => {
			// Clean up the subscription
			//   subscription.unsubscribe();
		};
	});
 

	// locationPath = location ? location : "/";
 
	return (
		<>
			<div className="d-none d-md-block bg-light sidebar flex-column">
				<div className="togglebtn">
					<button
						type="button"
						onClick={toggleSlideBar}
						className=" rounded bg-light "
					>
						<i className="arrow"></i>
					</button>
				</div>
				<div className="sidebar-header">
					<span className="sidebar-brand">{title ? title : "Menu"}</span>
				</div>
				<div className="sidebar-body">
					<Nav as="ul" variant="pills" className="flex-column">
						<Accordion defaultActiveKey={`acc-${key[0]}`}>
						{printAccordion("", "", items, "",key ,navLinkOnSelect)}
						</Accordion>
					</Nav>
				</div>
			</div>
		</>
	);
}

/** 
 * <Nav
	as="ul"
	className="flex-column"
	onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
	>
	<Accordion defaultActiveKey="0">
		<Accordion.Toggle as={"li"} variant="link" eventKey="0">
			Share Location
		</Accordion.Toggle>
		<Accordion.Collapse eventKey="0">
			<Nav.Item as={"li"}>
				<Nav.Link href="/home" as="a">
					Active
				</Nav.Link>
			</Nav.Item>
		</Accordion.Collapse>
	</Accordion>
	</Nav>
 */
/**
<ListGroup
								variant="flush" 
							>
					<Accordion defaultActiveKey="0">
						<Accordion.Toggle as={ListGroup.Item} eventKey="0">
							Share Location
						</Accordion.Toggle>
						<Accordion.Collapse eventKey="0">
							<>
								<ListGroup.Item  action onClick={addTab}>
									Map
								</ListGroup.Item>
							</>
						</Accordion.Collapse>

						<Accordion.Toggle as={ListGroup.Item} eventKey="1">
							Settings
						</Accordion.Toggle>
						<Accordion.Collapse eventKey="1">
							<>
								<ListGroup.Item   action onClick={alertClicked}>
									Link 1
								</ListGroup.Item>
								<ListGroup.Item   action onClick={alertClicked}>
									Link 1
								</ListGroup.Item>
							</>
						</Accordion.Collapse>
					</Accordion>
					</ListGroup>
 * 
 */
/**

const CustomToggle = React.forwardRef(
	({ children, title, className, onClick }, ref) => {
		if (title) {
			const [open, setOpen] = useState(false);

			return (
				<>
					<li
						className={`${className}`}
						onClick={() => setOpen(!open)}
						aria-expanded={open}
					>
						{title}
						<span className="action-icon">{open ? "-" : "+"}</span>
					</li>
					<Collapse in={open}>
						<ul className={`list-unstyled flex-column`}>{children}</ul>
					</Collapse>
				</>
			);
		}

		return (
			<li className={`list-unstyled flex-column ${className}`} ref={ref}>
				{children}
			</li>
		);
	}
); 

<Nav
						as="ul"
						className="flex-column"
						onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
					>
						<Nav.Item as={CustomToggle} title="Share Location">
							<Nav.Item as={CustomToggle}>
								<Nav.Link href="/home" as="a">
									Active
								</Nav.Link>
							</Nav.Item>
							<Nav.Item as={CustomToggle}>
								<Nav.Link eventKey="link-1" as="a">
									Link
								</Nav.Link>
								<Nav.Link eventKey="link-2" as="a">
									Link 2
								</Nav.Link>
							</Nav.Item>
						</Nav.Item>
						<Nav.Item as={CustomToggle}>
							<Nav.Link eventKey="disabled" disabled as="a">
								Disabled
							</Nav.Link>
						</Nav.Item>
						<Nav.Item as={CustomToggle}>cdcddc</Nav.Item>
					</Nav>
 */
