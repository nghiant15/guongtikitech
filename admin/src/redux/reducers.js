import { combineReducers } from 'redux';
import {getData_AllAPI} from './data/reducers';
const reducers = combineReducers({
  root: ()=>{return {}},
  getData_AllAPI
});

export default reducers;
