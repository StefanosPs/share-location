import React from 'react';
import DisplayError from '../display-error/display-error.component'

import PermissionError from '../../api/PermissionError'

export const errorHandler = (error, errorInfo) => {
	// alert('Global error!');
	console.error(error);
	//todo inform server
}

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error, errorInfo) {
		// Catch errors in any components below and re-render with error message
        console.log('error, errorInfo');
        console.error(error, errorInfo);
		this.setState({
			error: error,
			errorInfo: errorInfo
		});
		// You can also log error messages to an error reporting service here
	}


	render() {
  		if (this.state.error) {
			if(this.state.error instanceof PermissionError){
				return (<DisplayError>
					{this.state.error.getMessage()}
					</DisplayError> );
			}

			//TODO Alert
			return (<DisplayError>
				{this.state.error && this.state.error.message}
				</DisplayError> );
		}
		// Normally, just render children
		return this.props.children;
	}
}

export default ErrorBoundary;
