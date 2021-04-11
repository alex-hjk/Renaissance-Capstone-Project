/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import initialState from './initialState';

// Creates the actionCreators and reducers
export default createSlice({
  name: 'config',
  initialState,
  reducers: {
    updateUrls: (state, { payload: { clientUrl, cloudUrl } }) => {
      state.clientUrl = clientUrl;
      state.cloudUrl = cloudUrl;
    },
    updateConfig: (state, { payload: { masterKey, clientID } }) => {
      state.masterKey = masterKey;
      state.clientID = clientID;
    },
  },
});
