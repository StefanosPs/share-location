import React, { createContext, useContext, useState, useEffect } from 'react';

import { useAuth } from '../auth/auth.component';
import DisplayError from '../display-error/display-error.component';

import PermissionError from '../../api/PermissionError';

const PERMISSIONS = {
	ADMIN: {
		actions: {
			user: {
				POST: true,
				GET: true,
				PUT: true,
				DELETE: true
			},
			connections: {
				POST: true,
				GET: true,
				PUT: true,
				DELETE: true
			},
			mark: {
				POST: true,
				GET: true,
				PUT: true,
				DELETE: true
			}
		},
		menuItem: {
			dashboard: true,
			shareloc: true,
			'shareloc.map': true,
			settings: true,
			'settings.myProfile': true,
			'settings.userList': true
		},
		toolbarItem: {}
	},
	MODERATOR: {
		actions: {
			user: {
				POST: false,
				GET: true,
				PUT: true,
				DELETE: false
			},
			connections: {
				POST: true,
				GET: true,
				PUT: true,
				DELETE: true
			},
			mark: {
				POST: true,
				GET: true,
				PUT: true,
				DELETE: true
			}
		},
		menuItem: {
			dashboard: true,
			shareloc: true,
			'shareloc.map': true,
			settings: true,
			'settings.myProfile': true,
			'settings.userList': false
		},
		toolbarItem: {}
	},
	USER: {
		actions: {
			user: {
				GET: true
			},
			connections: {
				POST: true,
				GET: true,
				PUT: true,
				DELETE: true
			},
			mark: {
				POST: true,
				GET: true,
				PUT: true,
				DELETE: true
			}
		},
		menuItem: {
			dashboard: false,
			shareloc: true,
			'shareloc.map': true,
			settings: true,
			'settings.myProfile': true,
			'settings.userList': false
		},
		toolbarItem: {}
	},
	PUBLIC: {
		actions: null,
		menuItem: null,
		toolbarItem: null
	}
};

const permissionContext = createContext();

const PermissionProvider = ({ children }) => {
	const value = useProvidePermission();
	return <permissionContext.Provider value={value}>{children}</permissionContext.Provider>;
};

// const PermissionConsumer = ({ children }) => {
// 	return <permissionContext.Consumer>{children}</permissionContext.Consumer>;
// };
const usePermission = () => {
	return useContext(permissionContext);
};

const PermissionFormConsumer = ({ table, newRec, children, ...props }) => {
	return (
		<permissionContext.Consumer>
			{({ actions }) => {
				if (!actions) {
					return <DisplayError>{`loading permission`} </DisplayError>;
				}

				if (!actions[table]) {
					throw new PermissionError(403, `You can not access ${table} records`);
				}

				if (newRec && !actions[table].POST) {
					throw new PermissionError(403, `You can not create records to table ${table}`);
				}
				if (!newRec && !actions[table].PUT) {
					if (actions[table].GET) {
						return React.Children.map(children, child => {
							return React.cloneElement(child, { isReadOnly: true }, null);
						});
					} else {
						throw new PermissionError(403, `You can not edit records to table ${table}`);
					}
				}
				return children;
			}}
		</permissionContext.Consumer>
	);
};

const PermissionDataGridConsumer = ({ table, children }) => {
	return (
		<permissionContext.Consumer>
			{({ actions }) => {
				if (!actions) {
					return <DisplayError>{`loading permission`} </DisplayError>;
				}

				if (!actions[table]) {
					throw new PermissionError(403, `You can not access ${table} records`);
				}

				if (!actions[table].GET) {
					throw new PermissionError(403, `You can not read records from table ${table}`);
				}
				return children;
			}}
		</permissionContext.Consumer>
	);
};
const PermissionMenuItemConsumer = ({ menuItemId, children, ...props }) => {
	return (
		<permissionContext.Consumer>
			{({ menuItem }) => {
				return children;
			}}
		</permissionContext.Consumer>
	);
};

function useProvidePermission() {
	const auth = useAuth();
	const [permission, setPermission] = useState(PERMISSIONS.PUBLIC);

	useEffect(() => {
		if (auth?.user?.role && PERMISSIONS[auth.user.role.toUpperCase()]) {
			setPermission(PERMISSIONS[auth.user.role.toUpperCase()]);
		}
	}, [auth.user.role]);

	return permission;
}

export {
	PermissionProvider,
	usePermission,
	PermissionFormConsumer,
	PermissionDataGridConsumer,
	PermissionMenuItemConsumer
};
