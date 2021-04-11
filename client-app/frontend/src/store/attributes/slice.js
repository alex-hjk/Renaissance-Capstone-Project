/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';

// Creates the actionCreators and reducers
export default createSlice({
  name: 'feed',
  initialState,
  reducers: {
    updateAttributes: (state, { payload: { attributes } }) => {
      state.attributes = attributes;
    },
  },
});
