

import { addUser, loginUser, getUserByEmail } from '../models/user.model.js';


const showRegisterPage = (req, res) => {

  if (req.session.recruiter) {
    return res.redirect('/jobs');
  }

  res.render('pages/register', {
    title: 'Register as Recruiter',
    errors: [],
    formData: {}
  });
};


const registerRecruiter = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = []; 
  const formData = { name, email };


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


  if (email && getUserByEmail(email)) {
    errors.push('This email is already registered. Please login instead.');
  }


  if (errors.length > 0) {
    return res.render('pages/register', {
      title: 'Register as Recruiter',
      errors,
      formData
    });
  }


  const newUser = addUser({ name, email, password });


  req.session.recruiter = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email
  };


  req.session.successMsg = `Welcome, ${newUser.name}! Your recruiter account has been created.`;


  res.redirect('/jobs');
};


const showLoginPage = (req, res) => {

  if (req.session.recruiter) {
    return res.redirect('/jobs');
  }

  res.render('pages/login', {
    title: 'Recruiter Login',
    errors: [],
    formData: {}
  });
};


const loginRecruiter = (req, res) => {
  const { email, password } = req.body;
  const errors = [];
  const formData = { email }; // Return email on error (not password)


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


  const user = loginUser(email, password);

  if (!user) {
    return res.render('pages/login', {
      title: 'Recruiter Login',
      errors: ['Invalid email or password. Please try again.'],
      formData
    });
  }


  req.session.recruiter = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  req.session.successMsg = `Welcome back, ${user.name}!`;


  const redirectTo = req.session.returnTo || '/jobs';
  delete req.session.returnTo;
  res.redirect(redirectTo);
};


const logoutRecruiter = (req, res) => {
  const recruiterName = req.session.recruiter?.name;


  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }

    res.clearCookie('connect.sid');


    res.redirect('/login');
  });
};

export { showRegisterPage, registerRecruiter, showLoginPage, loginRecruiter, logoutRecruiter };
