import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { todoApi } from './todoApi';

export const allApis = [todoApi];

export const rootReducer = combineReducers({
  [todoApi.reducerPath]: todoApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...allApis.map((api) => api.middleware)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
