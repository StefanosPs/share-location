const inMemoryJWTManager = () => {
	let inMemoryJWT = null;
	let isRefreshing = null;
	let logoutEventNm = "user-logout";
	let refresh = '/jwt/refresh-token';
	let refreshTimeOutId;

	const initializeApp = ({ backEndHost, logoutEventName, refreshEndpoint }) => {
		logoutEventNm = logoutEventName ? logoutEventName : logoutEventNm;
		refresh = backEndHost + (refreshEndpoint ? refreshEndpoint : refresh); 
	};
 

	// This countdown feature is used to renew the JWT before it's no longer valid
	// in a way that is transparent to the user.
	const refreshToken = (delay) => {
		delay-=3000;
		refreshTimeOutId = window.setTimeout(
			getRefreshedToken,
			delay
		); // Validity period of the token in seconds, minus 5 seconds
	};

	const abordRefreshToken = () => {
		if (refreshTimeOutId) {
			window.clearTimeout(refreshTimeOutId);
		}
	};

	const waitForTokenRefresh = () => {
		if (!isRefreshing) {
			return Promise.resolve();
		}
		return isRefreshing.then(() => {
			isRefreshing = null;
			return true;
		});
	};

	// The method make a call to the refresh-token endpoint
	// If there is a valid cookie, the endpoint will set a fresh jwt in memory.
	const getRefreshedToken = () => { 

		isRefreshing = fetch(refresh, {	method: "POST",	credentials: "include"})
			.then((response) => {
				if (response.status !== 200) {
					ereaseToken();
					// global.console.log("Token renewal failure");
					return { token: null };
				}
				return response.json();
			})
			.then(({data}) => {
				const [{token, tokenExpiry}] = data;
				if (token) { 
					setToken(token, tokenExpiry);
					return true;
				}
				ereaseToken();
				return false;
			});

		return isRefreshing;
	};

	const getToken = () => inMemoryJWT;

	const setToken = (token, delay) => {
		inMemoryJWT = token;
		refreshToken(delay);
		return true;
	};

	const ereaseToken = () => {
		inMemoryJWT = null;
		abordRefreshToken();
		window.localStorage.setItem(logoutEventNm, Date.now());
		return true;
	};

	// This listener will allow to disconnect a session of ra started in another tab
	window.addEventListener("storage", (event) => {
		if (event.key === logoutEventNm) {
			inMemoryJWT = null;
		}
	});

	return {
		ereaseToken,
		getRefreshedToken,
		getToken,
		setToken,
		waitForTokenRefresh,
		initializeApp,
	};
};

export default inMemoryJWTManager();
