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
  constructor() {
    super();

    this.state = {
      questionnaireString: '',
      showFooter: true,
    }
  }

  componentDidMount() {
    window.addEventListener("message", (event) => {
      if (event.data.questionnaireString) {
        this.setState({
          questionnaireString: event.data.questionnaireString,
          showFooter: event.data.showFooter
        });
      }
    }, false);
  }

  render() {
    return (
      <Provider store={store}>
        <>
          {/*this.state.questionnaireString && (
            <Container 
              questionnaireString={this.state.questionnaireString} 
              showFooter={this.state.showFooter}
            />
          )*/}
          {<Iframetest />}
        </>
      </Provider>
    );
  }
}