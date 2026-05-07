// ============================================================
// controllers/user.controller.js
// Handles all recruiter authentication logic
// Controller sits between the Route and the Model
// ============================================================

import { addUser, loginUser, getUserByEmail } from '../models/user.model.js';

// ============================================================
// showRegisterPage — GET /register
// Simply renders the registration form
// ============================================================
const showRegisterPage = (req, res) => {
  // If already logged in, redirect to jobs page
  if (req.session.recruiter) {
    return res.redirect('/jobs');
  }

  res.render('pages/register', {
    title: 'Register as Recruiter',
    errors: [],
    formData: {}
  });
};

// ============================================================
// registerRecruiter — POST /register
// Validates form data and creates a new recruiter account
// ============================================================
const registerRecruiter = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = []; // Collect all validation errors
  const formData = { name, email }; // Send back form data on error (don't include password)

  // --- Validation ---
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !email.includes('@') || !email.includes('.')) {
    errors.push('Please enter a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  // Check if email already exists
  if (email && getUserByEmail(email)) {
    errors.push('This email is already registered. Please login instead.');
  }

  // If there are errors, re-render the form with error messages
  if (errors.length > 0) {
    return res.render('pages/register', {
      title: 'Register as Recruiter',
      errors,
      formData
    });
  }

  // --- Create the new recruiter ---
  const newUser = addUser({ name, email, password });

  // Auto-login after registration — set session
  req.session.recruiter = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  };

  // Flash success message
  req.session.successMsg = `Welcome, ${newUser.name}! Your recruiter account has been created.`;

  // Redirect to jobs page
  res.redirect('/jobs');
};

// ============================================================
// showLoginPage — GET /login
// Renders the login form
// ============================================================
const showLoginPage = (req, res) => {
  // Already logged in? Redirect away
  if (req.session.recruiter) {
    return res.redirect('/jobs');
  }

  res.render('pages/login', {
    title: 'Recruiter Login',
    errors: [],
    formData: {}
  });
};

// ============================================================
// loginRecruiter — POST /login
// Validates credentials and creates a session
// ============================================================
const loginRecruiter = (req, res) => {
  const { email, password } = req.body;
  const errors = [];
  const formData = { email }; // Return email on error (not password)

  // --- Validation ---
  if (!email || email.trim() === '') {
    errors.push('Email is required');
  }

  if (!password || password.trim() === '') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.render('pages/login', {
      title: 'Recruiter Login',
      errors,
      formData
    });
  }

  // --- Attempt to login ---
  const user = loginUser(email, password);

  if (!user) {
    return res.render('pages/login', {
      title: 'Recruiter Login',
      errors: ['Invalid email or password. Please try again.'],
      formData
    });
  }

  // --- Login successful — store in session ---
  req.session.recruiter = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  req.session.successMsg = `Welcome back, ${user.name}!`;

  // Redirect to where they were trying to go, or to jobs
  const redirectTo = req.session.returnTo || '/jobs';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};

// ============================================================
// logoutRecruiter — POST /logout
// Destroys the session and redirects to login
// ============================================================
const logoutRecruiter = (req, res) => {
  const recruiterName = req.session.recruiter?.name;

  // Destroy the session completely
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }
    // Clear the session cookie from browser
    res.clearCookie('connect.sid');

    // Redirect to login page
    res.redirect('/login');
  });
};

export { showRegisterPage, registerRecruiter, showLoginPage, loginRecruiter, logoutRecruiter };
