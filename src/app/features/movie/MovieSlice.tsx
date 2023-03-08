import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../shared/store/store';
import { Movie } from './interfaces/Movie';
import { getLatestMovieAsync } from './MovieAPI';

export interface MovieSate {
  isLoggedIn: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  latestMovie: Movie ;
}

export const movieSliceInitialState: MovieSate = {
  isLoggedIn: false,
  status: 'idle',
  error: null,
  latestMovie: {} as Movie,
};

export const getLatestMovie = createAsyncThunk('movie/getLatest', async () => {
  const movie = await getLatestMovieAsync();
  return movie.data;
});

export const authSlice = createSlice({
  name: 'movie',

  initialState: movieSliceInitialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getLatestMovie.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLatestMovie.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.latestMovie = action.payload;
      })
      .addCase(getLatestMovie.rejected, (state, action) => {
        state.error = action.error.message!;
        state.status = 'failed';
      });
  },
});

// selectors
export const selectLatestMovie = (state: RootState) => state.movie.latestMovie;
export const selectStatus = (state: RootState) => state.movie.status;
export const selectError = (state: RootState) => state.movie.error;

export default authSlice.reducer;
