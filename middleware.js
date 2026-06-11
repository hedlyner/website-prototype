// Basic Auth gate for Vercel Edge Middleware.
// Credentials come from Vercel project env vars: BASIC_AUTH_USER / BASIC_AUTH_PASS.
export const config = { matcher: ['/((?!favicon.ico).*)'] };

export default function middleware(req) {
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPass = process.env.BASIC_AUTH_PASS;

  // If env vars aren't configured, fail closed.
  if (expectedUser && expectedPass) {
    const auth = req.headers.get('authorization') || '';
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      try {
        const [user, ...passParts] = atob(encoded).split(':');
        const pass = passParts.join(':');
        if (user === expectedUser && pass === expectedPass) {
          return; // authorized — continue to the site
        }
      } catch (_) {
        // fall through to 401
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Hedlyner Prototype"' },
  });
}
