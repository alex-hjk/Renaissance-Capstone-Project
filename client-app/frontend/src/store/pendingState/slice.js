/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';

// Creates the actionCreators and reducers
export default createSlice({
  name: 'pendingState',
  initialState,
  reducers: {
    updatePendingState: (state, { payload: { isPending } }) => {
      state.isPending = isPending;
    },
  },
});
