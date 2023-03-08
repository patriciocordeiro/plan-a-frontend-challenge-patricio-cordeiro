import { rest } from 'msw';
import { setupServer } from 'msw/lib/node';

import movieReducer, { movieSliceInitialState } from './MovieSlice';

const handlers = [
  rest.get('/latest', (req, res, ctx) => {
    ctx.json({ title: 'Avatar' });
  }),
];

const server = setupServer(...handlers);

describe('MovieSlice', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('initialize slice with initialValue', () => {
    const listSliceInit = movieReducer(movieSliceInitialState, { type: 'unknown' });
    expect(listSliceInit).toBe(movieSliceInitialState);
  });
});
