

import { Router } from 'express';
import {
  showRegisterPage,
  registerRecruiter,
  showLoginPage,
  loginRecruiter,
  logoutRecruiter
} from '../controllers/user.controller.js';

const router = Router();



router.get('/register', showRegisterPage);
router.post('/register', registerRecruiter);

router.get('/login', showLoginPage);
router.post('/login', loginRecruiter);

router.post('/logout', logoutRecruiter);

export default router;
