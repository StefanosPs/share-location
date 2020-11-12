import inMemoryJWT from "../authentication/in-memory-jwt";

// export interface Options extends RequestInit {
//     user?: {
//         authenticated?: boolean;
//     };
// }

export const createHeadersFromOptions = (options) => {
	const requestHeaders =
		options.headers ||
		new Headers({
			Accept: "application/json",
		});
	if (
		!requestHeaders.has("Content-Type") &&
		!(options && (!options.method || options.method === "GET")) &&
		!(options && options.body && options.body instanceof FormData)
	) {
		requestHeaders.set("Content-Type", "application/json");
	}

	if (options.user && options.user.authenticated) {
		const token = inMemoryJWT.getToken();
		// console.log('token', token);
		requestHeaders.set("Authorization", `Bearer ${token}`);
	}

	return requestHeaders;
};
/**
 * 
 * @param {string} url 
 * @param {object} options
 * @param {Headers} options.headers
 * @param {(GET|POST|PUT|DELETE)} options.method
 */
export const fetchJson = async (url, options = {}) => {
	const requestHeaders = createHeadersFromOptions(options);

	return fetch(url, { ...options, headers: requestHeaders })
		.then((response) => {
			if(response.status === 204){
				return {
					statusCode: 204,
					data: []
				}
			}
			return response.json()
		})
		.then(({statusCode, ...props}) => {
			if (statusCode < 200 || statusCode >= 300) {
				return Promise
					.reject({
                    	...props
                    });
			}
			//TODO status Code Handler
			return Promise.resolve({ statusCode, ...props });
		});
};


export const getBackEndHost = () => {
	return  (process.env.REACT_APP_BACKEND_PROTOCOL || "http") +
	"://" +
	(process.env.REACT_APP_BACKEND_HOST || window.document.location.hostname) +
	(process.env.REACT_APP_BACKEND_PORT
		? `:${process.env.REACT_APP_BACKEND_PORT}`
		: "");
}

export const getBackEndWsHost = () => {
	return  (process.env.REACT_APP_BACKEND_WS_PROTOCOL || "ws") +
	"://" +
	(process.env.REACT_APP_BACKEND_WS_HOST || window.document.location.hostname) +
	(process.env.REACT_APP_BACKEND_WS_PORT
		? `:${process.env.REACT_APP_BACKEND_WS_PORT}`
		: "") +
	"/websocket/location";
}