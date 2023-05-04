const paginationReducer = (state, action) => {
    switch (action.type) {
      case 'SET_CURRENT_PAGE':
        return { ...state, currentPage: action.payload }
      case 'SET_TOTAL_RECORDS':
        return { ...state, totalRecords: action.payload }
      default:
        return state
    }
  }

export default paginationReducer