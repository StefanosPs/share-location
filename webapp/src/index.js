import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { errorHandler } from './components/error-boundary/error-boundary.component';

// <React.StrictMode>
// </React.StrictMode>,
ReactDOM.render(
  <App />, 
  document.getElementById('root')
);

window.addEventListener('error', event => {
  event.stopPropagation();
  event.preventDefault();
	errorHandler(event.error);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
