// ============================================================
// middlewares/auth.middleware.js
// Protects routes that require a logged-in recruiter
// ============================================================

// ============================================================
// isAuthenticated
// Checks if req.session.recruiter exists
// If not, save the intended URL and redirect to login
// ============================================================
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.recruiter) {
    // User is logged in — proceed to the next middleware/route handler
    return next();
  }

  // Not logged in — save where they were trying to go
  req.session.returnTo = req.originalUrl;
  req.session.errorMsg = 'Please login to access this page.';

  // Redirect to login page
  res.redirect('/login');
};

// ============================================================
// isGuest
// Redirects logged-in users away from login/register pages
// ============================================================
const isGuest = (req, res, next) => {
  if (req.session && req.session.recruiter) {
    // Already logged in, redirect to jobs
    return res.redirect('/jobs');
  }
  next();
};

export { isAuthenticated, isGuest };
