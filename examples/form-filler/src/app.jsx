import * as React from 'react';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './root/rootReducer';
import Container from './root/container';
import './resetcss.css';
import './vendors.css';
import './skjemautfyller.css';
import './header-footer.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk));
const store = createStore(rootReducer, enhancer);

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            questionnaireString: '',
            language: '',
            selectedReceiverEndpoint: '',
        };
    }

    componentDidMount() {
        window.addEventListener(
            'message',
            (event) => {
                if (event.data.questionnaireString) {
                    this.setState({
                        questionnaireString: event.data.questionnaireString,
                        language: event.data.language,
                        selectedReceiverEndpoint: event.data.selectedReceiverEndpoint,
                    });
                }
            },
            false,
        );
    }

    render() {
        return (
            <Provider store={store}>
                <>
                    {this.state.questionnaireString && (
                        <Container
                            questionnaireString={this.state.questionnaireString}
                            language={this.state.language}
                            selectedReceiverEndpoint={this.state.selectedReceiverEndpoint}
                        />
                    )}
                </>
            </Provider>
        );
    }
}
