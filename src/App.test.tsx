import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import App from './App';
import { renderWithProviders } from './app/shared/utils/test.util';

describe('App component', () => {
  it('renders the AppRoutes component', () => {
    const history = createMemoryHistory({initialEntries:['/login']});

    renderWithProviders(
      <Router history={history}>
        <App />
      </Router>
    );

    const appRoutesElement = screen.getByTestId('app-routes');
    expect(appRoutesElement).toBeInTheDocument();
  });
});
