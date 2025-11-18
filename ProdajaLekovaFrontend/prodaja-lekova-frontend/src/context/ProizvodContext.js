import proizvodReducer from '../reducers/proizvodReducer';
import { createGenericContext } from './createGenericContext';

const initialState = {
  proizvodi: []
};

const { Provider, useContextHook } = createGenericContext(
  proizvodReducer,
  initialState,
  'Proizvod'
);

export const ProizvodProvider = Provider;
export const useProizvod = useContextHook;