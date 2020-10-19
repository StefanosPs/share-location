import inMemoryJWT from "./in-memory-jwt";
import AuthError from "./AuthError"

class AuthProvider {
	static initializeApp = ({
		authDomain,
		loginEndPoint,
		logoutEndPoint,
		logoutEventName,
		refreshEndpoint,
	}) => {
		return new AuthProvider({
			authDomain,
			loginEndPoint,
			logoutEndPoint,
			logoutEventName,
			refreshEndpoint,
		});
	};

	constructor({
		authDomain,
		loginEndPoint,
		logoutEndPoint,
		logoutEventName,
		refreshEndpoint,
	}) {
		this.backEndHost = authDomain ? authDomain : "";
		this.loginEndPoint =
			this.backEndHost + (loginEndPoint ? loginEndPoint : "/jwt/login");
		this.logoutEndPoint =
			this.backEndHost + (logoutEndPoint ? logoutEndPoint : "/jwt/logout");
		inMemoryJWT.initializeApp({
			backEndHost: this.backEndHost,
			logoutEventName,
			refreshEndpoint: refreshEndpoint,
		});
	}
	async login({ username, password }) {
		const request = new Request(this.loginEndPoint, {
			method: "POST",
			headers: new Headers({ "Content-Type": "application/json" }),
			body: JSON.stringify({ username, password }),
			mode: "cors",
			credentials: "include",
		});
		
		return fetch(request)
			.then((response) => {
				if (response.status > 499) {
					throw new Error(response.statusText);
				}
				return response.json();
			})
			.then(({ data, message, statusCode, errors, ...params }) => {
				if (statusCode !== 200) {
					// console.log(message, statusCode, errors, ...params);
					throw new AuthError(statusCode, errors, message);
				}
				const [{ token, tokenExpiry }] = data;

				inMemoryJWT.setToken(token, tokenExpiry);
				return JSON.parse(atob(token.split(".")[1]));
			});
	}
	async logout() {
		const token = inMemoryJWT.getToken();
		const request = new Request(this.logoutEndPoint, {
			method: "POST",
			headers: new Headers({ 
				"Content-Type": "application/json",
				"Authorization" : `Bearer ${token}`
			}),
			mode: "cors",
			credentials: "include",
		});
		inMemoryJWT.ereaseToken();

		return fetch(request).then(() => "/jwt/login");
	}
	async checkAuth() {
		return inMemoryJWT.getRefreshedToken().then(() => {
			return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
		});
	}

	async checkError(error) {
		const status = error.status;
		if (status === 401 || status === 403) {
			inMemoryJWT.ereaseToken();
			return Promise.reject();
		}
		return Promise.resolve();
	}

	async getPermissions() {
		return inMemoryJWT.waitForTokenRefresh().then(() => {
			return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
		});
	}

	getUser() {
		let token = inMemoryJWT.getToken();
		if (!token) {
			throw new Error("Undefined User");
		}
		const tokenData = JSON.parse(atob(token.split(".")[1]));
		return tokenData && tokenData.user ? tokenData.user : undefined;
	}
}

export default AuthProvider;
