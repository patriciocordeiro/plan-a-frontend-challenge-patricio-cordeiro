import { fireEvent, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { renderWithProviders } from '../../shared/utils/test.util';
import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
  test('Should logout and go to login page when click on logout button', async () => {
    const history = createMemoryHistory();

    renderWithProviders(
      <Router history={history}>
        <HomeScreen />
      </Router>
    );

    const logoutButton = await screen.findByRole('button', { name: 'Logout' });

    fireEvent.click(logoutButton);
    expect(history.location.pathname).toBe('/login');
  });
});
