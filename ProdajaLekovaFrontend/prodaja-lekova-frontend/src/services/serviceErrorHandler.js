import { toast } from 'react-toastify';

/**
 * Generic error handler for service layer
 * Eliminates repetitive try-catch blocks across service files
 * @param {Function} serviceFunction - The async service function to execute
 * @param {Object} options - Configuration options
 * @param {boolean} options.showErrorToast - Whether to show error toast (default: false)
 * @param {string} options.errorMessage - Custom error message for toast
 * @returns {Promise} - Returns the service function result or error status
 */
export const handleServiceError = async (serviceFunction, options = {}) => {
  const { showErrorToast = false, errorMessage = 'Došlo je do greške' } = options;

  try {
    const result = await serviceFunction();
    return result;
  } catch (error) {
    console.error('Service error:', error);

    if (showErrorToast) {
      const message = error.response?.data?.message || errorMessage;
      toast.error(message);
    }

    // Return status code for backward compatibility
    return error.response?.status || 500;
  }
};

/**
 * Wrapper for service functions that require authentication
 * @param {Function} apiCall - The API function to call
 * @param {Object} params - Parameters for the API call
 * @param {string} params.token - Authentication token
 * @param {Function} configBuilder - Function to build auth config
 * @returns {Promise} - Returns the API response or error status
 */
export const withAuth = async (apiCall, params, configBuilder) => {
  return handleServiceError(async () => {
    const authConfig = configBuilder(params.token);
    return await apiCall(params.data, authConfig);
  });
};
