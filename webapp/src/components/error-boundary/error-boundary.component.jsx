import React from 'react';
import DisplayError from '../display-error/display-error.component'
export const errorHandler = (error, errorInfo) => {
	alert('Global error!');
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
        console.log(this.state.errorInfo);
		if (this.state.errorInfo) {
			// Error path
			//TODO Alert
			return (
				<DisplayError>
					{this.state.error && this.state.error.toString()}
					<br />
					{this.state.errorInfo.componentStack}
				</DisplayError>
			);
		}
		// Normally, just render children
		return this.props.children;
	}
}

export default ErrorBoundary;
