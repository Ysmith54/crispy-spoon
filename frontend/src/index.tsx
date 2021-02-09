import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import'./index.css';
import reducer, {AppState} from './reducer';
import {AppAction} from './actions';
import { createStore, applyMiddleware, Store } from 'redux';

const store: Store<AppState, AppAction> = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store = {store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
