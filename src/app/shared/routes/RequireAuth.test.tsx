import { cleanup, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Router } from 'react-router-dom';

import { renderWithProviders } from '../utils/test.util';
import { PrivateRoute } from './RequireAuth';

describe('RequireAuth', () => {
  afterEach(() => cleanup());
  test('render children if user is logged in', () => {
    const children = <div>Hello</div>;
    const history = createMemoryHistory({ initialEntries: ['/'] });

    renderWithProviders(
      <Router history={history}>
          <PrivateRoute isLoggedIn={true} children={children}></PrivateRoute>
      </Router>
    );

    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    expect(history.location.pathname).toBe('/');

  });

  test('redirect to login if user is not  logged in', () => {
    const children = <div>Hello</div>;
    const history = createMemoryHistory({ initialEntries: ['/'] });
    
    renderWithProviders(
      <Router history={history}>
        <Route path='/'>
          <PrivateRoute isLoggedIn={false} children={children}></PrivateRoute>
        </Route>
      </Router>
    );

    expect(history.location.pathname).toBe('/login');
  });
});
