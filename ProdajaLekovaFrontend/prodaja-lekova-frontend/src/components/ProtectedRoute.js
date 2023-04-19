import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const AuthRoute = ({ element: Component, state }) => (
  <Route render={() =>
    state.token ? (
      <Navigate to={{ pathname: '/'}} />
    ) : (
      <Component />
    )
  } />
);

export default AuthRoute;
