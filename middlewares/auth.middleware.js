
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.recruiter) {

    return next();
  }


  req.session.returnTo = req.originalUrl;
  req.session.errorMsg = 'Please login to access this page.';


  res.redirect('/login');
};


const isGuest = (req, res, next) => {
  if (req.session && req.session.recruiter) {
    // Already logged in, redirect to jobs
    return res.redirect('/jobs');
  }
  next();
};

export { isAuthenticated, isGuest };
