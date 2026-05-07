// ============================================================
// middlewares/validation.middleware.js
// Centralized validation helpers used across the application
// These are reusable functions — not Express middleware per se,
// but helper utilities that controllers can call
// ============================================================

// ============================================================
// validateEmail(email)
// Returns true if the email looks valid
// ============================================================
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// ============================================================
// validateRequired(value)
// Returns true if the value is not empty
// ============================================================
const validateRequired = (value) => {
  return value !== undefined && value !== null && String(value).trim() !== '';
};

// ============================================================
// validateMinLength(value, min)
// Returns true if value length is >= min
// ============================================================
const validateMinLength = (value, min) => {
  return validateRequired(value) && String(value).trim().length >= min;
};

// ============================================================
// validateFutureDate(dateStr)
// Returns true if the date is in the future
// ============================================================
const validateFutureDate = (dateStr) => {
  const date = new Date(dateStr);
  return !isNaN(date) && date > new Date();
};

// ============================================================
// validateRegisterForm(body)
// Validates recruiter registration form
// Returns array of error messages (empty if all valid)
// ============================================================
const validateRegisterForm = (body) => {
  const { name, email, password, confirmPassword } = body;
  const errors = [];

  if (!validateMinLength(name, 2))
    errors.push('Name must be at least 2 characters long');

  if (!validateEmail(email))
    errors.push('Please enter a valid email address');

  if (!validateMinLength(password, 6))
    errors.push('Password must be at least 6 characters');

  if (password !== confirmPassword)
    errors.push('Passwords do not match');

  return errors;
};

// ============================================================
// validateLoginForm(body)
// Validates login form
// ============================================================
const validateLoginForm = (body) => {
  const { email, password } = body;
  const errors = [];

  if (!validateRequired(email)) errors.push('Email is required');
  if (!validateRequired(password)) errors.push('Password is required');

  return errors;
};

// ============================================================
// validateJobForm(body)
// Validates job creation/update form
// ============================================================
const validateJobForm = (body) => {
  const { jobcategory, jobdesignation, joblocation, companyname,
          salary, applyby, skillsrequired, numberofopenings } = body;
  const errors = [];

  if (!validateRequired(jobcategory)) errors.push('Job category is required');
  if (!validateMinLength(jobdesignation, 3)) errors.push('Job title must be at least 3 characters');
  if (!validateRequired(joblocation)) errors.push('Job location is required');
  if (!validateRequired(companyname)) errors.push('Company name is required');
  if (!validateRequired(salary)) errors.push('Salary range is required');
  if (!validateFutureDate(applyby)) errors.push('Apply by date must be a future date');
  if (!validateRequired(skillsrequired)) errors.push('At least one skill is required');
  if (!numberofopenings || parseInt(numberofopenings) < 1)
    errors.push('At least 1 opening is required');

  return errors;
};

// ============================================================
// validateApplicantForm(body, file)
// Validates job application form
// ============================================================
const validateApplicantForm = (body, file) => {
  const { name, email, contact } = body;
  const errors = [];

  if (!validateMinLength(name, 2)) errors.push('Full name must be at least 2 characters');
  if (!validateEmail(email)) errors.push('Please enter a valid email address');
  if (!validateMinLength(contact, 10)) errors.push('Contact number must be at least 10 digits');
  if (!file) errors.push('Resume (PDF) is required');

  return errors;
};

export {
  validateEmail,
  validateRequired,
  validateMinLength,
  validateFutureDate,
  validateRegisterForm,
  validateLoginForm,
  validateJobForm,
  validateApplicantForm
};
