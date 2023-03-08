import { Redirect, Route, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
}

export const PrivateRoute = ({ isLoggedIn, children, ...rest }: PrivateRouteProps) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
