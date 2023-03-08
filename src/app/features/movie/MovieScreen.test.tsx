import { screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { environment } from '../../../environments';
import { renderWithProviders } from '../../shared/utils/test.util';
import { Movie } from './interfaces/Movie';
import MovieScreen from './MovieScreen';

const latestMovieMock: Movie = {
  title: 'Avatar',
  original_language: 'en',
  overview: 'My favorite movie',
};

const handlers = [
  rest.get(`${environment.baseUrl}/movie/latest`, (req, res, ctx) => {
    return res(ctx.json<Movie>(latestMovieMock), ctx.delay(150));
  }),
];

const server = setupServer(...handlers);

describe('MovieScreen', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('should render loading message when status is loading', async () => {
    renderWithProviders(<MovieScreen />);

    expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
  });

  test('should render latest movie when status is succeeded', async () => {
    renderWithProviders(<MovieScreen />);

    expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(latestMovieMock.title, 'i'))).toBeInTheDocument();
    expect(await screen.findByText(new RegExp(latestMovieMock.overview, 'i'))).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(latestMovieMock.original_language, 'i'))
    ).toBeInTheDocument();
  });

  test('should render error when get last movie fails', async () => {

    const handlers = [
      rest.get(`${environment.baseUrl}/movie/latest`, (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ message: 'Error getting latest movie' }));
      }),
    ];

    server.resetHandlers(...handlers);

    renderWithProviders(<MovieScreen />);

    expect(await screen.findByText(/Error/i)).toBeInTheDocument();
  });
});
