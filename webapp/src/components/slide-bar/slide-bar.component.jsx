import React, { useState, useEffect, useContext, createContext } from 'react';
import { Nav, Accordion } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { usePermission } from '../permission/permission.component';

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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		data,
		setKeys,
		toggleSlideBar
	};
};

export const useSlideBar = () => {
	return useContext(slideBarContext);
};

const initializeMenu = (
	accordion,
	key,
	menuItemPermission,
	item,
	href = '',
	activeKeys = [],
	currentUrl,
	setKeys
) => {
	if (typeof item !== 'object') {
		return ;
	}
	if (!item.nodes && !item.displayAtSlideBar) {
		return;
	}

	if(!(menuItemPermission)){
		console.log(menuItemPermission);
		return;
	}

	if(key && !(menuItemPermission[key.substr(6)]) ){
		return;
	}


	if (!key) {
		key = 'route';
	}
	if (item.path) {
		href += item.path;
	}




	if (activeKeys.length === 0 && href === currentUrl) {
		setKeys([accordion, key]);
	}


	if (!item.nodes && item.displayAtSlideBar) {
		return {
			key,
			href,
			icon: item.icon,
			name: item.name
		}
		
	}

	const menuItems = Object.entries(item.nodes).map(([tmpKey, subItem], id) => {
		return initializeMenu(
			`${key}`,
			`${key}.${tmpKey}`,
			menuItemPermission,
			subItem,
			href,
			activeKeys, 
			currentUrl,
			setKeys
		);
	});

	return {
		key ,
		href,
		name: item.name,
		nodes: menuItems
	}
}

const printAccordion = (
	accordion,
	key,
	item, 
	activeKeys = [],
	navLinkOnSelect 
) => {
	if (typeof item !== 'object') {
		return '';
	}
 

	if (!item.nodes) { 
		const isActive = activeKeys[1] === key ? true : false;
		return (
			<Nav.Item as={'li'} key={`Nav.Item-${key}`}>
				<Nav.Link eventKey={[accordion, key, item.href]} onSelect={navLinkOnSelect} active={isActive}>
					{item.icon ? <i className={item.icon} /> : ''}
					{item.name}
				</Nav.Link>
			</Nav.Item>
		);
		 
	}

	
	const menuItems = item.nodes.map((subItem) => {
		if(subItem){
			return printAccordion(
				`${key}`,
				`${subItem.key}`,
				subItem, 
				activeKeys,
				navLinkOnSelect 
			);
		}
		return null;
		
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
	const { menuItem : menuItemPermission  } = usePermission(); 
	const { data, setKeys, toggleSlideBar } = useSlideBar();
	const [ element, setElement] = useState();


	useEffect(() => {
		const elements = initializeMenu(
			'',
			'',
			menuItemPermission,
			items,
			'',
			data.menuIdAr,
			history.location.pathname,
			setKeys
		);

		setElement(elements);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [menuItemPermission]);

	const navLinkOnSelect = (eventKey, event) => {
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
	};

	if(!element){
		return null;
	}
	return (
		<div className="d-none d-md-block bg-light sidebar flex-column">
			<div className="togglebtn">
				<button type="button" onClick={() => toggleSlideBar()} className=" rounded bg-light ">
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
							element, 
							data.menuIdAr,
							navLinkOnSelect 
						)}
					</Accordion>
				</Nav>
			</div>
		</div>
	);
}
