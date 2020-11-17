import React from 'react';

import { BrowserRouter, Route } from 'react-router-dom';

import { ReactQueryConfigProvider } from 'react-query';
import { ToastProvider } from 'react-toast-notifications';

import { ProvideAuth } from './components/auth/auth.component';
import { PermissionProvider } from './components/permission/permission.component';
import MainPage from './pages/main/main';

import { fetchJson, urlQueryBuilder } from './api/APIUtils';

function App() {
	return (
		<ProvideAuth>
			<ReactQueryConfigProvider
				config={{
					queries: {
						queryFn: (url, params = {}, options = {}) => {
							let urlParams = '?';

							if (params) {
								urlParams += urlQueryBuilder(params);
							}
							if (!options.headers) {
								options.headers = new Headers({ Accept: 'application/json' });
							}

							options.user = {
								authenticated: true
							};

							return fetchJson(`${url}${urlParams}`, options);
						},
						refetchOnWindowFocus: false,
						forceFetchOnMount: true
					}
				}}
			>
				<PermissionProvider>
					<ToastProvider>
						<BrowserRouter>
							<Route path="/" render={props => <MainPage {...props} />} />
						</BrowserRouter>
					</ToastProvider>
				</PermissionProvider>
			</ReactQueryConfigProvider>
		</ProvideAuth>
	);
}

export default App;
