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
		// .then((response) =>
		// 	response.json().then((json) => ({
		// 		status: response.status,
		// 		headers: response.headers,
		// 		body: json,
		// 	}))
		// )
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
			// console.log(res)
			// const { status, headers, body } = res;
			// let json;
			// try {
			// 	json = JSON.parse(body);
			// } catch (e) {
			// 	// not json, no big deal
			// }
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

export default {
	fetchJson,
};
