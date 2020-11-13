import React from 'react';

import Maps from '../../views/maps';
import DataList from '../../views/data-list';
import DataForm from '../../views/data-form';
import MyProfile from '../../views/my-profile';

export const routes = {
	path: '/admin',
	nodes: {
		dashboard: {
			name: 'Dashboard',
			path: '/dashboard',
			icon: 'pe-7s-graph',
			component: props => <h1>Dashboard</h1>,
			isLink: true,
			isBasicRedirect: true,
			displayAtSlidebar: true
		},
		shareloc: {
			name: 'Share Location',
			nodes: {
				map: {
					name: 'Maps',
					path: '/maps',
					icon: 'pe-7s-map-marker',
					component: props => <Maps {...props} />,
					isLink: true,
					isBasicRedirect: false,
					displayAtSlidebar: true
				}
			}
		},
		settings: {
			name: 'Settings',
			isLeaf: false,
			nodes: {
				myProfile: {
					path: '/profile',
					name: 'My Profile',
					icon: 'pe-7s-user',
					component: props => {
						return <MyProfile title={`My Profile`} />;
					},
					isLink: true,
					isBasicRedirect: false,
					displayAtSlidebar: true
				},
				userList: {
					path: '/user',
					name: 'User List',
					icon: 'pe-7s-user',
					component: props => <DataList title={`User List`} table="user" {...props} />,
					isLink: true,
					isBasicRedirect: false,
					displayAtSlidebar: true
				},
				userEdit: {
					path: '/user/:id',
					name: 'User Profile',
					icon: 'pe-7s-user',
					component: props => {
						const id = props.match.params.id ? parseInt(props.match.params.id, 10) : 0;
						return <DataForm title={`User Edit`} table="user" id={id} newRec={false} {...props} />;
					},
					isLink: true,
					isBasicRedirect: false,
					displayAtSlidebar: false
				},
				userNew: {
					path: '/user/new',
					name: 'New User',
					icon: 'pe-7s-user',
					component: props => (
						<DataForm title={`New User`} id={0} table="user" newRec={true} {...props} />
					),
					isLink: true,
					isBasicRedirect: false,
					displayAtSlidebar: false
				},

				userConnectionsList: {
					path: '/user/:refId/connections/',
					name: 'User Connections',
					icon: '',
					component: ({ match, ...props }) => {
						const {
							params: { refId }
						} = match;
						return (
							<DataList
								title={`User Connections List`}
								refTable="user"
								refId={refId}
								table="connections"
								{...props}
							/>
						);
					},
					isLink: true,
					isBasicRedirect: false,
					displayAtSlidebar: false
				},
				userConnectionsEdit: {
					path: '/user/:refId/connections/:id',
					name: 'User Connections Edit',
					icon: '',
					component: ({ match, ...props }) => {
						const {
							params: { refId, id }
						} = match;
						return (
							<DataForm
								title={`User Connections Edit`}
								refTable="user"
								refId={refId}
								table="connections"
								newRec={false}
								id={id}
								{...props}
							/>
						);
					},
					isLink: true,
					isBasicRedirect: false,
					displayAtSlidebar: false
				},
				userConnectionsNew: {
					path: '/user/:refId/connections/new',
					name: 'New User Connections',
					icon: '',
					component: ({ match, ...props }) => {
						const {
							params: { refId }
						} = match;
						return (
							<DataForm
								title={`New User Connections`}
								refTable="user"
								refId={refId}
								id={0}
								newRec={true}
								table="connections"
								{...props}
							/>
						);
					},
					isLink: true,
					isBasicRedirect: false,
					displayAtSlidebar: false
				}
			}
		}
	}
};
