import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../shared/store/hooks';
import { getLatestMovie, selectError, selectLatestMovie, selectStatus } from './MovieSlice';

export const MovieScreen = () => {
  const dispatch = useAppDispatch();
  const latestMovie = useAppSelector(selectLatestMovie)!;
  const movieStatus = useAppSelector(selectStatus);
  const movieError = useAppSelector(selectError);

  useEffect(() => {
    dispatch(getLatestMovie());
  }, [dispatch]);

  const renderGetMovieError = () => (movieError ? <span>Error loading latest movie</span> : null);

  return (
    <div className='Movie-main-container'>
      {movieStatus === 'loading' ? (
        'Loading'
      ) : (
        <div>
          <h1>Latest Movie</h1>
          {renderGetMovieError()}
          <div>
            <h3> {latestMovie.title}</h3>
            <p> {latestMovie.overview}</p>
            <p>
              <span>Language</span>: {latestMovie.original_language}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieScreen;
