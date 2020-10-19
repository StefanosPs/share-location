import React, { useState, useEffect, useContext, createContext } from "react";

import Loading from "../loading/loading.component";

import AuthProvider from "../../authentication";

const BACKEND_HOST = (process.env.REACT_APP_BACKEND_PROTOCOL || 'http') + '://'+ (process.env.REACT_APP_BACKEND_HOST || window.document.location.hostname) + ((process.env.REACT_APP_BACKEND_PORT)? `:${process.env.REACT_APP_BACKEND_PORT}` : '' ) ;


// Add your Firebase credentials
const auth = AuthProvider.initializeApp({
	authDomain: BACKEND_HOST,
});
// console.log(auth);
const authContext = createContext();

export function ProvideAuth({ children }) {
	const auth00 = useProvideAuth();
	return (
		<authContext.Provider value={auth00}>
			{auth00.isLoading() ? <Loading/> : children}
		</authContext.Provider>
	);
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
	return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const isLoading = () => (loading);

	// Wrap any Firebase methods we want to use making sure ...
	// ... to save the user to state.
	const signIn = async (username, password) => { 
		try {
			let response = await auth.login(username, password);
			if (response.user) {
				setUser(response.user);
				return response.user;
			}
		} catch (error) {
			setUser(false);
			throw error;
		}
		return null;
	};

	// const signUp = (email, password) => {
	// 	//TODO signup
	// };

	const signOut = () => {
		return auth.logout().then(() => {
			setUser(false);
		});
	};

	// const sendPasswordResetEmail = (email) => {

	// };

	// const confirmPasswordReset = (code, password) => {

	// };

	// Subscribe to user on mount
	// Because this sets state in the callback it will cause any ...
	// ... component that utilizes this hook to re-render with the ...
	// ... latest auth object.
	useEffect(() => { 
		auth
			.checkAuth()
			.then((resp) => {
				const usr = auth.getUser(); 
				setUser(usr);
				setLoading( false );
			})
			.catch(() => {
				setUser(false);
				setLoading( false );
			});

		// return () => {
		// 	return auth.logout().then(() => {
		// 		setUser(false);
		// 	});
		// };
		return () => {};
	}, []);

	// Return the user object and auth methods
	return {
		user,
		signIn,
		// signUp,
		signOut,
		// sendPasswordResetEmail,
		// confirmPasswordReset,
		isLoading,
	};
}
