

import express from 'express';           
import session from 'express-session';   
import cookieParser from 'cookie-parser'; 
import methodOverride from 'method-override'; 
import path from 'path';                 
import { fileURLToPath } from 'url';     

  
import userRoutes from './routes/user.routes.js';
import jobRoutes from './routes/job.routes.js';


import { lastVisitMiddleware } from './middlewares/lastVisit.middleware.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());


app.use(methodOverride('_method'));


app.use(express.static(path.join(__dirname, 'public')));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(session({
  secret: 'jobportal_secret_key_2024', 
  resave: false,                       
  saveUninitialized: false,            
  cookie: {
    maxAge: 1000 * 60 * 60 * 24        
  }
}));



app.use(lastVisitMiddleware);


app.use((req, res, next) => {
  res.locals.currentUser = req.session.recruiter || null;
  res.locals.lastVisit = req.cookies.lastVisit || null;
  res.locals.successMsg = req.session.successMsg || null;
  res.locals.errorMsg = req.session.errorMsg || null;
  
  delete req.session.successMsg;
  delete req.session.errorMsg;
  next();
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/', userRoutes);   
app.use('/', jobRoutes);    


app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found'
  });
});


app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).render('pages/404', {
    title: 'Server Error',
    message: 'Something went wrong on our end.'
  });
});


app.listen(PORT, () => {
  console.log(`✅ Job Portal running at http://localhost:${PORT}`);
  console.log(`📁 Press Ctrl+C to stop`);
});

export default app;
