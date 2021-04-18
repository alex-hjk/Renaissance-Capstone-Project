/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';

// Creates the actionCreators and reducers
export default createSlice({
  name: 'intermediateAttributes',
  initialState,
  reducers: {
    updateInitClientRes: (state, { payload: { initClientRes } }) => {
      state.initClientRes = initClientRes;
    },
    updateResultRetrievalReq: (state, { payload: { resultsRetrievalReq } }) => {
      state.resultsRetrievalReq = resultsRetrievalReq;
    },
  },
});
