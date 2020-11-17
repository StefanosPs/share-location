import React, { useState, useEffect } from 'react';
import { Nav, Accordion } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './slide-bar.styles.scss';

const classNameShow = 'sidebar-show';

const printAccordion = (accordion, key, item, href = '', activeKeys = [], navLinkOnSelect) => {
	if (typeof item !== 'object') {
		return '';
	}

	if (!key) {
		key = 'route';
	}
	if (item.path) {
		href += item.path;
	}

	if (!item.nodes) {
		if (item.displayAtSlideBar) {
			const isActive = activeKeys[1] === key ? true : false;

			return (
				<Nav.Item as={'li'} key={`Nav.Item-${key}`}>
					<Nav.Link
						// as={Link}
						eventKey={[accordion, key, href]}
						onSelect={navLinkOnSelect}
						active={isActive}
					>
						{item.icon ? <i className={item.icon} /> : ''}
						{item.name}
					</Nav.Link>
				</Nav.Item>
			);
		} else {
			return;
		}
	}

	// const tmpKeys = Object.keys(item.nodes);
	const menuItems = Object.entries(item.nodes).map(([tmpKey, value], id) => {
		return printAccordion(
			`${key}`,
			`${key}.${tmpKey}`,
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
		console.log(key);
		return (
			<React.Fragment key={key}>
				<Accordion.Toggle as={Nav.Link} variant="link" eventKey={`acc-${key}`}>
					{item.name}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={`acc-${key}`} className={isActive ? 'show' : ''}>
					<Nav as="ul" variant="pills" className="flex-column" key={`nav-${key}`}>
						{menuItems}
					</Nav>
				</Accordion.Collapse>
			</React.Fragment>
		);
	}
};

export default function SideBar({ items, title }) {
	const history = useHistory();

	let historyParams = (history?.location?.state?.sideBar) ? [...history.location.state.sideBar] : []; 

	const [key, setKey] = useState(historyParams);

	
	const isOpen = () => {
		let el = document.getElementById('root');
		if (el && el.classList) {
			return el.classList.contains(classNameShow);
		}

		return false;
	};

	const toggleSlideBar = () => {
		let el = document.getElementById('root');
		if (el) {
			el.classList.toggle(classNameShow);
		}
	};

	const navLinkOnSelect = (eventKey, event) => {
		const keys = eventKey.split(',');
		setKey([keys[0], keys[1]]);

		history.push(
			{
				pathname: keys[2]
			},
			{
				sideBar: [keys[0], keys[1]]
			}
		);
	};

	useEffect(() => {
		if (!isOpen()) {
			toggleSlideBar();
		}

		return () => { 
			
		};
	}, []); 

	return (
		<>
			<div className="d-none d-md-block bg-light sidebar flex-column">
				<div className="togglebtn">
					<button type="button" onClick={toggleSlideBar} className=" rounded bg-light ">
						<i className="arrow"></i>
					</button>
				</div>
				<div className="sidebar-header">
					<span className="sidebar-brand">{title ? title : 'Menu'}</span>
				</div>
				<div className="sidebar-body">
					<Nav as="ul" variant="pills" className="flex-column">
						<Accordion defaultActiveKey={`acc-${key[0]}`}>
							{printAccordion('', '', items, '', key, navLinkOnSelect)}
						</Accordion>
					</Nav>
				</div>
			</div>
		</>
	);
}
