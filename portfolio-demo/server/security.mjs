// The hash allows only the existing fixed window.zipsters bootstrap. Keep the
// Vercel policy in sync; tests verify every rendered executable inline script.
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'sha256-oMTTw36cUIhBtgae3i5Dcei/kpam+76RetoQ6B9R71E='; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};
