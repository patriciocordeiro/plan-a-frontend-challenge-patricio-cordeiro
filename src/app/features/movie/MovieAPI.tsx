import axios, { AxiosResponse } from 'axios';

import { environment } from '../../../environments';
import { Movie } from './interfaces/Movie';

export async function getLatestMovieAsync(): Promise<AxiosResponse<Movie>> {
  return await axios.get<null, AxiosResponse<Movie>>(
    `${environment.baseUrl}/movie/latest?api_key=${environment.apiKey}`
  );
}
