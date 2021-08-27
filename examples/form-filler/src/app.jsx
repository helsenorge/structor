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
            showFooter: true,
        };
    }

    componentDidMount() {
        window.addEventListener(
            'message',
            (event) => {
                if (event.data.questionnaireString) {
                    this.setState({
                        questionnaireString: event.data.questionnaireString,
                        showFooter: event.data.showFooter,
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
                            showFooter={this.state.showFooter}
                        />
                    )}
                </>
            </Provider>
        );
    }
}
