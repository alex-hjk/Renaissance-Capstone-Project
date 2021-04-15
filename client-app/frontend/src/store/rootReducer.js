import { combineReducers } from '@reduxjs/toolkit';
import attributesSlice from './attributes/slice';
import configSlice from './config/slice';
import pendingStateSlice from './pendingState/slice';

export default combineReducers({
  attributes: attributesSlice.reducer,
  config: configSlice.reducer,
  pendingState: pendingStateSlice.reducer,
});
