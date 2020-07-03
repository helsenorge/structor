import * as React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './root/reducer';
import Container from './root/container';
import Iframetest from './root/iframetest';
import './resetcss.css';
import './master.css';
import './minhelse.css';
import './skjemautfyller.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
  applyMiddleware(thunk)
);
const store = createStore(rootReducer, enhancer);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Iframetest />
      </Provider>
    );
  }
}