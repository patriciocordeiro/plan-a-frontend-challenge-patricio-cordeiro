import { Action, combineReducers, configureStore, PreloadedState, ThunkAction } from '@reduxjs/toolkit';

import authReducer from '../../features/auth/authSlice';
import movieReducer from '../../features/movie/MovieSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  movie: movieReducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type AppStore = ReturnType<typeof setupStore>;

export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
