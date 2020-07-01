import { combineReducers } from 'redux';
import form from '@helsenorge/skjemautfyller/reducers/form';

const rootReducer = combineReducers({
  skjemautfyller: combineReducers({ form: form }),
});

export default rootReducer;
