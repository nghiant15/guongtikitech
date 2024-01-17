import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import 'core-js';
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/css/sidebar.css';
import * as serviceWorker from './serviceWorker';

import { icons } from './assets/icons'

import { Provider } from 'react-redux'
import store from './store'
import { createStore, applyMiddleware } from 'redux';
import rootReducers from "./../src/redux/reducers";
import createSagaMiddleware from 'redux-saga'
import root from "./../src/redux/sagas"

const sagaMiddleware = createSagaMiddleware()
const storeS = createStore(rootReducers, applyMiddleware(sagaMiddleware))

React.icons = icons

sagaMiddleware.run(root)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
