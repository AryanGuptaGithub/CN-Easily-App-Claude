// ============================================================
// middlewares/lastVisit.middleware.js
// Tracks and stores the user's last visit using cookies
// Cookies persist in the browser even after closing the tab
// ============================================================

// ============================================================
// lastVisitMiddleware
// Reads the existing lastVisit cookie, stores it in req
// Then sets a NEW cookie with the current timestamp
// ============================================================
const lastVisitMiddleware = (req, res, next) => {
  // Get the previous last visit from cookie (if it exists)
  const lastVisit = req.cookies.lastVisit;

  if (lastVisit) {
    // Store it so views can display it
    req.lastVisit = lastVisit;
  } else {
    req.lastVisit = null; // First time visitor
  }

  // Set/update the cookie with the CURRENT time
  // This cookie expires in 365 days
  res.cookie('lastVisit', new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }), {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    httpOnly: true                       // Prevent JavaScript access (security)
  });

  next();
};

export { lastVisitMiddleware };
