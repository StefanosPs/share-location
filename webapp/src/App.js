import React from "react";

import { BrowserRouter, Route } from "react-router-dom";

import { ReactQueryConfigProvider } from "react-query";

import { ProvideAuth } from "./components/auth/auth.component";
import MainPage from "./pages/main/main";

import { fetchJson } from "./api/APIUtils";

function App() { 

	return (
		<ProvideAuth>
			<ReactQueryConfigProvider
				config={{
					queries: {
						queryFn: (url, params = {}, options = {}) => { 
							let urlParams = '?';
							if(params){
								urlParams += new URLSearchParams(params);
							}
							if (!options.headers) {
								options.headers = new Headers({ Accept: "application/json" });
							}

							options.user = {
								authenticated: true
							};

							return fetchJson(`${url}${urlParams}`, options);
						}, 
						refetchOnWindowFocus: false,
						forceFetchOnMount: true
					},
				}}
			>
				<BrowserRouter>
					<Route path="/" render={(props) => <MainPage {...props} />} />
				</BrowserRouter>
			</ReactQueryConfigProvider>
		</ProvideAuth>
	);
}

export default App;
