import React, { createContext, useReducer, useContext, useMemo } from 'react';

/**
 * Generic context factory to eliminate code duplication across context files
 * @param {Function} reducer - The reducer function for state management
 * @param {Object} initialState - The initial state object
 * @param {string} contextName - Name of the context for debugging
 * @returns {Object} - Returns { Provider, useContextHook }
 */
export const createGenericContext = (reducer, initialState, contextName) => {
  const Context = createContext();
  Context.displayName = contextName;

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ state, dispatch }), [state]);

    return (
      <Context.Provider value={value}>
        {children}
      </Context.Provider>
    );
  };

  const useContextHook = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${contextName} must be used within ${contextName}Provider`);
    }
    return context;
  };

  return { Provider, useContextHook };
};
