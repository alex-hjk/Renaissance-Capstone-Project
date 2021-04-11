// import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './rootReducer';

const createStore = () => {
  const store = configureStore({
    reducer: rootReducer,
  });

  return { store };
};

export default createStore;
