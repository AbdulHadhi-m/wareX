export const API_VERSION = 'v1';

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

export const REGEX = {
  IMEI: /^\d{15}$/,
  SERIAL_NUMBER: /^[A-Za-z0-9\-]{1,50}$/,
  OBJECT_ID: /^[a-f\d]{24}$/i,
} as const;
