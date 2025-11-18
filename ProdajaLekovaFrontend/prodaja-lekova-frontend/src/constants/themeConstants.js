// Theme constants to replace magic numbers throughout the app

export const SPACING = {
  NONE: 0,
  TINY: '4px',
  SMALL: '8px',
  SMALL_PLUS: '10px',
  SMALL_MEDIUM: '15px',
  MEDIUM: '16px',
  LARGE: '20px',
  XLARGE: '24px',
  XXLARGE: '32px',
  HUGE: '40px',
  VERY_LARGE: '50px',
  EXTRA_LARGE: '100px',
  MASSIVE: '120px',
  ENORMOUS: '200px',
};

export const FONT_SIZE = {
  TINY: '0.75rem',
  SMALL: '0.875rem',
  MEDIUM: '1rem',
  LARGE: '1.25rem',
  XLARGE: '1.5rem',
  XXLARGE: '2rem',
  XXXLARGE: '3rem',
};

export const DIMENSIONS = {
  // Heights
  INPUT_HEIGHT: '40px',
  BUTTON_HEIGHT: '36px',
  HEADER_HEIGHT: '64px',
  CARD_MIN_HEIGHT: '200px',

  // Widths
  SIDEBAR_WIDTH: '240px',
  CONTAINER_MAX_WIDTH: '1200px',
  DIALOG_MAX_WIDTH: '600px',
  DIALOG_MIN_WIDTH: '300px',
  TABLE_MIN_WIDTH: 650,

  // Images
  LOGO_WIDTH: '150px',
  PRODUCT_IMAGE_HEIGHT: '200px',
  THUMBNAIL_SIZE: '50px',
};

export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 900,
  LG: 1200,
  XL: 1536,
};

export const PERCENTAGES = {
  HALF: '50%',
  SIXTY: '60%',
  SEVENTY: '70%',
  FULL: '100%',
  DISCOUNT_MAX: 150,
};

export const MISC = {
  MARGIN_BOTTOM_CART: '30px',
  TABLE_COL_SPAN_DEFAULT: 4,
};

export const COLORS = {
  PRIMARY: '#2A7C6C',
  SECONDARY: '#CCE8E1',
  TERTIARY: '#F1DFDB',
  WHITE: '#FFFFFF',
  ERROR: '#d32f2f',
  SUCCESS: '#2e7d32',
  WARNING: '#ed6c02',
  INFO: '#0288d1',
};

export const Z_INDEX = {
  DRAWER: 1200,
  MODAL: 1300,
  TOOLTIP: 1500,
  NOTIFICATION: 1400,
};

export const TRANSITION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 9,
  ITEMS_PER_PAGE: 9,
};

export const API_TIMEOUTS = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 60000, // 60 seconds
};

export const FORM_VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_INPUT_LENGTH: 250,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
};

export const LAYOUT = {
  BORDER_RADIUS: {
    SMALL: '4px',
    MEDIUM: '8px',
    LARGE: '12px',
    ROUND: '50%',
  },
  BOX_SHADOW: {
    LIGHT: '0 2px 4px rgba(0,0,0,0.1)',
    MEDIUM: '0 4px 8px rgba(0,0,0,0.15)',
    HEAVY: '0 8px 16px rgba(0,0,0,0.2)',
  },
};
