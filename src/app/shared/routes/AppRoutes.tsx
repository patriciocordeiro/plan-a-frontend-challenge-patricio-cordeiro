import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import AuthLoginScreen from '../../features/auth/AuthLoginScreen';
import { selectIsLoggedIn } from '../../features/auth/authSlice';
import HomeScreen from '../../features/home/HomeScreen';
import { PrivateRoute } from './RequireAuth';

const AppRoutes = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <Switch>
      <PrivateRoute exact path='/' isLoggedIn={isLoggedIn}>
        <HomeScreen />
      </PrivateRoute>
      <Route path='/login'>
        <AuthLoginScreen />
      </Route>
    </Switch>
  );
};

export default AppRoutes;
