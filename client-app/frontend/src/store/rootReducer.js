import { combineReducers } from '@reduxjs/toolkit';
import attributesSlice from './attributes/slice';
import configSlice from './config/slice';
import pendingStateSlice from './pendingState/slice';
import intermediateAttributesSlice from './intermediateAttributes/slice';

export default combineReducers({
  attributes: attributesSlice.reducer,
  config: configSlice.reducer,
  pendingState: pendingStateSlice.reducer,
  intermediateAttributes: intermediateAttributesSlice.reducer,
});
