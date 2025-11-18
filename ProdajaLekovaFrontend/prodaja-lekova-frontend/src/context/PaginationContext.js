import paginationReducer from '../reducers/PaginationReducer';
import { createGenericContext } from './createGenericContext';

const initialState = {
  currentPage: 1,
  totalRecords: 0,
  pageSize: 9
};

const { Provider, useContextHook } = createGenericContext(
  paginationReducer,
  initialState,
  'Pagination'
);

export const PaginationProvider = Provider;
export const usePagination = useContextHook;
