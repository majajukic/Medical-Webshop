import apotekaReducer from '../reducers/apotekaReducer';
import { createGenericContext } from './createGenericContext';

const initialState = {
  apoteke: []
};

const { Provider, useContextHook } = createGenericContext(
  apotekaReducer,
  initialState,
  'Apoteka'
);

export const ApotekaProvider = Provider;
export const useApoteka = useContextHook;