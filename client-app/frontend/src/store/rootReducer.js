import { combineReducers } from '@reduxjs/toolkit';
import attributesSlice from './attributes/slice';
import configSlice from './config/slice';

export default combineReducers({
  attributes: attributesSlice.reducer,
  config: configSlice.reducer,
});
