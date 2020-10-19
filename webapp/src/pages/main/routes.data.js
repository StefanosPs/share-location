import React from "react";

import Maps from "../../views/maps";
import DataList from "../../views/data-list";
import DataForm from "../../views/data-form";

export const routes = {
	path: "/admin",
	nodes: {
		dashboard: {
			name: "Dashboard",
			path: "/dashboard",
			icon: "pe-7s-graph",
			component: (props) => <h1>Dashboard</h1>,
			isLink: true,
			isBasicRedirect:true,
			displayAtSlidebar: true
		},
		shareloc: {
			name: "Share Location",
			nodes: {
				map: {
					name: "Maps",
					path: "/maps",
					icon: "pe-7s-map-marker",
					component: (props) => <Maps {...props} />,
					isLink: true,
					isBasicRedirect:false,
					displayAtSlidebar: true
				},
			},
		},
		settings: {
			name: "Settings",
			isLeaf: false,
			nodes: {
				userList: {
					path: "/user",
					name: "User List",
					icon: "pe-7s-user",
					component: (props) => <DataList title={`User List`} table="user" {...props} />,
					isLink: true,
					isBasicRedirect:false,
					displayAtSlidebar: true
				},
				userEdit: {
					path: "/user/:id",
					name: "User Profile",
					icon: "pe-7s-user",
					component: (props) => <DataForm title={`User Edit`} table="user" {...props} />,
					isLink: true,
					isBasicRedirect:false,
					displayAtSlidebar: false
				},
				userNew: {
					path: "/user/new",
					name: "New User",
					icon: "pe-7s-user",
					component: (props) => <DataForm title={`New User`} table="user"  {...props}	/>,
					isLink: true,
					isBasicRedirect:false,
					displayAtSlidebar: false
				},

				userConnectionsList: {
					path: "/user/:refId/connections/" ,
					name: "User Connections",
					icon: "",
					component: (props) =>  <DataList title={`User Connections List`} refTable="user" table="connections" {...props} />,
					isLink: true,
					isBasicRedirect:false,
					displayAtSlidebar: false
				},
				userConnectionsEdit: {
					path: "/user/:refId/connections/:id",
					name: "User Connections Edit",
					icon: "",
					component: (props) => <DataForm title={`User Connections Edit`} refTable="user" table="connections" {...props} />,
					isLink: true,
					isBasicRedirect:false,
					displayAtSlidebar: false
				},
				userConnectionsNew: {
					path: "/user/:refId/connections/new",
					name: "New User Connections",
					icon: "",
					component: (props) => <DataForm title={`New User Connections`} refTable="user" table="connections" {...props} />,
					isLink: true,
					isBasicRedirect:false,
					displayAtSlidebar: false
				}, 
			},
		},
	},
};
