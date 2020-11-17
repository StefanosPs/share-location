import React, { useState, useEffect, createContext } from 'react';
import { Nav, Accordion } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './slide-bar.styles.scss';

const classNameShow = 'sidebar-show';

const slideBarContext = createContext();

export function SlideBarProvide({ children }) {
	const value = useProvideSlideBar();
	return <slideBarContext.Provider value={value}>{children}</slideBarContext.Provider>;
}

const useProvideSlideBar = () => {
	const [data, setData] = useState({
		menuIdAr: [],
		isOpen: true
	});

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
			setOpen(el.classList.toggle(classNameShow));
		}
	};

	const setOpen = isOpen => {
		 console.log(`setOpen ${isOpen}`);
		setData(prev => ({
			...prev,
			isOpen
		}));
	};
	const setKeys = menuIdAr => {
		setData(prev => ({
			...prev,
			menuIdAr
		}));
	};

	useEffect(() => {
		if (!isOpen() && data.isOpen) {
			toggleSlideBar();
		}

		return () => {};
	}, []);

	return {
		data, 
		setKeys,
		toggleSlideBar
	};
};

const printAccordion = (accordion, key, item, href = '', activeKeys = [], navLinkOnSelect, currentUrl, setKeys) => {
	if (typeof item !== 'object') {
		return '';
	}

	if (!key) {
		key = 'route';
	}
	if (item.path) {
		href += item.path;
	}

	if(activeKeys.length === 0 && href === currentUrl){
		setKeys([accordion, key]);
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
		return printAccordion(`${key}`, `${key}.${tmpKey}`, value, href, activeKeys, navLinkOnSelect, currentUrl, setKeys);
	});
	if (!item.name) {
		return menuItems;
	} else {
		const isActive = activeKeys[0] === key ? true : false;
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

export default function SlideBar({ items, title }) {
	const history = useHistory(); 

	return (
		<slideBarContext.Consumer>
			{({ data, setOpen, setKeys, toggleSlideBar }) => (
				<div className="d-none d-md-block bg-light sidebar flex-column">
					<div className="togglebtn">
						<button
							type="button"
							onClick={() => toggleSlideBar()}
							className=" rounded bg-light "
						>
							<i className="arrow"></i>
						</button>
					</div>
					<div className="sidebar-header">
						<span className="sidebar-brand">{title ? title : 'Menu'}</span>
					</div>
					<div className="sidebar-body">
						<Nav as="ul" variant="pills" className="flex-column">
							<Accordion defaultActiveKey={`acc-${data.menuIdAr[0]}`}>
								{printAccordion(
									'', 
									'', 
									items, 
									'', 
									data.menuIdAr, 
									(eventKey, event) => {
										const keys = eventKey.split(',');
										setKeys([keys[0], keys[1]]);
										history.push(
											{
												pathname: keys[2]
											},
											{
												sideBar: [keys[0], keys[1]]
											}
										);
									},
									history.location.pathname,
									setKeys
								)}
							</Accordion>
						</Nav>
					</div>
				</div>
			)}
		</slideBarContext.Consumer>
	);
}
