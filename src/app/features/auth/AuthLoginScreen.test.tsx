import { cleanup, fireEvent, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { rest } from 'msw';
import { setupServer } from 'msw/lib/node';
import { Router } from 'react-router-dom';

import { environment } from '../../../environments';
import { renderWithProviders } from '../../shared/utils/test.util';
import AuthLoginScreen from './AuthLoginScreen';
import { authInitialState } from './authSlice';

const userCredentials = { username: 'planatest', password: '123456' };

const handlers = [
  rest.get(`${environment.baseUrl}/authentication/token/new`, (req, res, ctx) =>
    res(ctx.json({ request_token: '112' }))
  ),
  rest.post(
    `${environment.baseUrl}/authentication/token/validate_with_login`,
    async (req, res, ctx) => {
      const { username, password } = await req.json();
      if (username === userCredentials.username && password === userCredentials.password) {
        return res(ctx.status(200), ctx.json({ message: 'Login successful' }));
      } else {
        return res(ctx.status(401), ctx.json({ message: 'Invalid username or password' }));
      }
    }
  ),
];

const server = setupServer(...handlers);

describe('LoginScreen', () => {
  beforeAll(() => server.listen());
  beforeEach(() => server.resetHandlers());
  afterAll(() => server.close());

  afterEach(() => cleanup());

  test('should render email and password inputs on the login screen', async () => {
    renderWithProviders(<AuthLoginScreen />);

    expect(await screen.findByLabelText('E-mail')).toBeInTheDocument();
    expect(await screen.findByLabelText('Password')).toBeInTheDocument();
  });

  test('should enable submit button when login form is valid', async () => {
    renderWithProviders(<AuthLoginScreen />);

    const emailInput = await screen.findByLabelText('E-mail');
    const passwordInput = await screen.findByLabelText('Password');
    const submitButton = await screen.findByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(submitButton).toBeEnabled();
  });

  test('should disable submit button when email is invalid', async () => {
    renderWithProviders(<AuthLoginScreen />);

    const emailInput = await screen.findByLabelText('E-mail');
    const passwordInput = await screen.findByLabelText('Password');
    const submitButton = await screen.findByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(submitButton).toBeDisabled();
  });

  test('should disable submit button when password is invalid', async () => {
    renderWithProviders(<AuthLoginScreen />);

    const emailInput = await screen.findByLabelText('E-mail');
    const passwordInput = await screen.findByLabelText('Password');
    const submitButton = await screen.findByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '12' } });
    expect(submitButton).toBeDisabled();
  });

  test('should render error invalid email when email is invalid', async () => {
    renderWithProviders(<AuthLoginScreen />);

    const emailInput = await screen.findByLabelText('E-mail');
    const passwordInput = await screen.findByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@test' } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(await screen.findByText(/Invalid e-mail/i)).toBeInTheDocument();
  });

  test('should render error Password length must be greater or equal to 6 when password length is less than 6', async () => {
    renderWithProviders(<AuthLoginScreen />);

    const emailInput = await screen.findByLabelText('E-mail');
    const passwordInput = await screen.findByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '12' } });
    fireEvent.blur(passwordInput);

    expect(
      await screen.findByText(/Password length must be equal or greater than 6/i)
    ).toBeInTheDocument();
  });

  test('should render error Required field when email is empty', async () => {
    renderWithProviders(<AuthLoginScreen />);

    const emailInput = await screen.findByLabelText('E-mail');
    const passwordInput = await screen.findByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: null } });
    fireEvent.blur(emailInput);
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    expect(await screen.findByText(/Required field/i)).toBeInTheDocument();
  });

  test('should render error Required field when password is empty', async () => {
    renderWithProviders(<AuthLoginScreen />);

    const emailInput = await screen.findByLabelText('E-mail');
    const passwordInput = await screen.findByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.blur(passwordInput);
    expect(await screen.findByText(/Required field/i)).toBeInTheDocument();
  });

  test('should login and navigate to  home page', async () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });

    renderWithProviders(
      <Router history={history}>
        <AuthLoginScreen />
      </Router>,
      { preloadedState: { auth: { ...authInitialState, isLoggedIn: false } } }
    );

    const emailInput = await screen.findByLabelText('E-mail');
    const passwordInput = await screen.findByLabelText('Password');
    const submitButton = await screen.findByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Loading/i)).toBeInTheDocument();
    expect(history.location.pathname).toEqual('/');
  });

  test('should redirect to home when is already loggedIn', () => {
    const history = createMemoryHistory({ initialEntries: ['/login'] });

    renderWithProviders(
      <Router history={history}>
        <AuthLoginScreen />
      </Router>,
      { preloadedState: { auth: { ...authInitialState, isLoggedIn: true } } }
    );

    expect(history.location.pathname).toEqual('/');
  });

  test('should render login error when invalid username or password', async () => {
    renderWithProviders(<AuthLoginScreen />);

    const emailInput = await screen.findByLabelText('E-mail');
    const passwordInput = await screen.findByLabelText('Password');
    const submitButton = await screen.findByRole('button', { name: 'Login' });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '890890' } });

    fireEvent.click(submitButton);

    expect(await screen.findByText(/Invalid E-mail \/ Password/i)).toBeInTheDocument();
  });
});
