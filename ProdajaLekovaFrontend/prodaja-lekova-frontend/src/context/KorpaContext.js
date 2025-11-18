import korpaReducer from '../reducers/korpaReducer';
import { createGenericContext } from './createGenericContext';

const initialState = {
  porudzbina: {}
};

const { Provider, useContextHook } = createGenericContext(
  korpaReducer,
  initialState,
  'Korpa'
);

export const KorpaProvider = Provider;
export const useKorpa = useContextHook;