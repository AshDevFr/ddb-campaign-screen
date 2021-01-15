import { combineReducers } from 'redux';
import characterSliceReducer from './characterSlice';
import menuSliceReducer from './menuSlice';
import optionsSliceReducer from './optionsSlice';

export default combineReducers({
  characters: characterSliceReducer,
  menu: menuSliceReducer,
  options: optionsSliceReducer
});
