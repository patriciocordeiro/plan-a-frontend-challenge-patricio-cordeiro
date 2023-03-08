import authReducer, { authInitialState, AuthSate, logout, setIsLoggedIn } from './authSlice';

describe('AuthSlice', () => {
  let initialState: AuthSate;

  beforeEach(() => {
    initialState = authInitialState;
  });

  test('should set initialState', async () => {
    expect(authReducer(initialState, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle logout', async () => {
    expect(authReducer(initialState, logout())).toEqual({
      ...initialState,
      isLoggedIn: false,
    });
  });

  test('should handle setIsLoggedIn', async () => {
    expect(authReducer(initialState, setIsLoggedIn(false))).toEqual({
      ...initialState,
      isLoggedIn: false,
    });
    expect(authReducer(initialState, setIsLoggedIn(true))).toEqual({
      ...initialState,
      isLoggedIn: true,
    });
  });
});
