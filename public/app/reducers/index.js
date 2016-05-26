import mocks from './mocks';
import { combineReducers } from 'redux';
import {reducer as formReducer} from 'redux-form';

export default combineReducers({
  mocks,
  form: formReducer
});
