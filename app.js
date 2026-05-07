// ============================================================
// app.js — Main entry point of the Job Portal application
// This file sets up Express, middleware, routes, and the server
// ============================================================

import express from 'express';           // Express framework for handling HTTP
import session from 'express-session';   // Session management for login
import cookieParser from 'cookie-parser'; // Parse cookies from requests
import methodOverride from 'method-override'; // Allow PUT/DELETE from HTML forms
import path from 'path';                 // Node.js path utilities
import { fileURLToPath } from 'url';     // ES6 module path helper

// --- Import our custom routes ---
import userRoutes from './routes/user.routes.js';
import jobRoutes from './routes/job.routes.js';

// --- Import middleware ---
import { lastVisitMiddleware } from './middlewares/lastVisit.middleware.js';

// ============================================================
// ES6 module fix: __dirname is not available in ES modules
// We manually recreate it using import.meta.url
// ============================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Create the Express application ---
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE SETUP
// Middleware runs before every request handler.
// Think of it as a pipeline — each request flows through these.
// ============================================================

// 1. Parse incoming JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Parse cookies attached to requests
app.use(cookieParser());

// 3. Allow forms to send PUT/DELETE requests via ?_method=DELETE
app.use(methodOverride('_method'));

// 4. Serve static files (CSS, JS, images) from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// 5. Serve uploaded resumes as static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Configure express-session for login state management
app.use(session({
  secret: 'jobportal_secret_key_2024', // Secret key to sign the session ID cookie
  resave: false,                        // Don't re-save session if unchanged
  saveUninitialized: false,             // Don't save empty sessions
  cookie: {
    maxAge: 1000 * 60 * 60 * 24        // Session lasts 24 hours
  }
}));

// 7. Last Visit Tracking Middleware (custom cookie middleware)
app.use(lastVisitMiddleware);

// 8. Make session data available in ALL EJS templates automatically
//    This means every view can access `user` and `lastVisit`
app.use((req, res, next) => {
  res.locals.currentUser = req.session.recruiter || null;
  res.locals.lastVisit = req.cookies.lastVisit || null;
  res.locals.successMsg = req.session.successMsg || null;
  res.locals.errorMsg = req.session.errorMsg || null;
  // Clear flash messages after passing them to views
  delete req.session.successMsg;
  delete req.session.errorMsg;
  next();
});

// ============================================================
// VIEW ENGINE SETUP
// Tell Express to use EJS for rendering .ejs files
// Set the views folder location
// ============================================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============================================================
// ROUTES
// Mount our route handlers at specific URL prefixes
// ============================================================
app.use('/', userRoutes);   // Handles /login, /register, /logout
app.use('/', jobRoutes);    // Handles /jobs, /apply, etc.

// ============================================================
// 404 HANDLER
// If no route matches, show the 404 page
// This MUST be the last route defined
// ============================================================
app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found'
  });
});

// ============================================================
// GLOBAL ERROR HANDLER
// Catches any unexpected server errors
// ============================================================
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).render('pages/404', {
    title: 'Server Error',
    message: 'Something went wrong on our end.'
  });
});

// ============================================================
// START THE SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`✅ Job Portal running at http://localhost:${PORT}`);
  console.log(`📁 Press Ctrl+C to stop`);
});

export default app;
