// ============================================================
// routes/user.routes.js
// Defines all authentication-related URL routes
// Routes only define: METHOD + PATH + which controller to call
// ============================================================

import { Router } from 'express';
import {
  showRegisterPage,
  registerRecruiter,
  showLoginPage,
  loginRecruiter,
  logoutRecruiter
} from '../controllers/user.controller.js';

const router = Router();

// ============================================================
// AUTH ROUTES
// GET  /register → Show registration form
// POST /register → Process registration
// GET  /login    → Show login form
// POST /login    → Process login
// POST /logout   → Destroy session
// ============================================================

router.get('/register', showRegisterPage);
router.post('/register', registerRecruiter);

router.get('/login', showLoginPage);
router.post('/login', loginRecruiter);

router.post('/logout', logoutRecruiter);

export default router;
