import DOMPurify from 'dompurify'

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - The user input to sanitize
 * @param {object} options - DOMPurify configuration options
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input, options = {}) => {
  if (typeof input !== 'string') {
    return input
  }

  const defaultOptions = {
    ALLOWED_TAGS: [], // Strip all HTML tags by default
    ALLOWED_ATTR: [], // Strip all HTML attributes by default
    KEEP_CONTENT: true, // Keep text content even when removing tags
  }

  return DOMPurify.sanitize(input, { ...defaultOptions, ...options })
}

/**
 * Sanitizes an object's string values recursively
 * @param {object} obj - The object to sanitize
 * @returns {object} - Object with sanitized string values
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }

  const sanitized = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value)
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value)
      } else {
        sanitized[key] = value
      }
    }
  }

  return sanitized
}

/**
 * Sanitizes form data before submission
 * @param {FormData|object} formData - Form data to sanitize
 * @returns {object} - Sanitized form data
 */
export const sanitizeFormData = (formData) => {
  if (formData instanceof FormData) {
    const sanitized = {}
    for (const [key, value] of formData.entries()) {
      sanitized[key] = typeof value === 'string' ? sanitizeInput(value) : value
    }
    return sanitized
  }

  return sanitizeObject(formData)
}
