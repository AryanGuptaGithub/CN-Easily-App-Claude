
const lastVisitMiddleware = (req, res, next) => {
 
  const lastVisit = req.cookies.lastVisit;

  if (lastVisit) {

    req.lastVisit = lastVisit;
  } else {
    req.lastVisit = null; 
  }


  res.cookie('lastVisit', new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }), {
    maxAge: 365 * 24 * 60 * 60 * 1000, 
    httpOnly: true                       
  });

  next();
};

export { lastVisitMiddleware };
