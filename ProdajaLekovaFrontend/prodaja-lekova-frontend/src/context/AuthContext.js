import authReducer from '../reducers/authReducer';
import { createGenericContext } from './createGenericContext';

const initialState = {
  token: localStorage.getItem('token') || null,
};

const { Provider, useContextHook } = createGenericContext(
  authReducer,
  initialState,
  'Auth'
);

export const AuthProvider = Provider;
export const useAuth = useContextHook;
