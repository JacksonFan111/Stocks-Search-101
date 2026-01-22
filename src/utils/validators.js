// Input validation utilities for security

export const validateSearchQuery = (query) => {
  // Type check
  if (!query || typeof query !== 'string') {
    throw new Error('Search query must be a non-empty string');
  }

  const trimmed = query.trim();

  // Empty check
  if (trimmed.length === 0) {
    throw new Error('Search query cannot be empty');
  }

  // Length check (prevent DoS)
  if (trimmed.length > 50) {
    throw new Error('Search query too long (max 50 characters)');
  }

  // Pattern check (allow alphanumeric, spaces, hyphens, dots)
  // This prevents XSS and SQL injection attempts
  if (!/^[a-zA-Z0-9\s\-\.]+$/.test(trimmed)) {
    throw new Error('Invalid characters in search query. Only letters, numbers, spaces, hyphens, and dots allowed');
  }

  return trimmed;
};

export const validateStockSymbol = (symbol) => {
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Stock symbol must be a non-empty string');
  }

  const trimmed = symbol.trim().toUpperCase();

  if (trimmed.length === 0) {
    throw new Error('Stock symbol cannot be empty');
  }

  if (trimmed.length > 10) {
    throw new Error('Stock symbol too long');
  }

  // Allow alphanumeric and dots (for BRK.B type symbols)
  if (!/^[A-Z0-9\.]+$/.test(trimmed)) {
    throw new Error('Invalid stock symbol format');
  }

  return trimmed;
};
