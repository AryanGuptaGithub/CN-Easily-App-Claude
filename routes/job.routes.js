
import { Router } from 'express';
import {
  showLandingPage,
  showAllJobs,
  showJobDetails,
  showCreateJobPage,
  createNewJob,
  showUpdateJobPage,
  updateExistingJob,
  deleteExistingJob,
  showApplyPage,
  submitApplication,
  showApplicants,
  showMyJobs
} from '../controllers/job.controller.js';

import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { uploadResume } from '../middlewares/upload.middleware.js';

const router = Router();


router.get('/', showLandingPage);


router.get('/jobs', showAllJobs);

router.get('/jobs/new', isAuthenticated, showCreateJobPage);

router.get('/jobs/:id', showJobDetails);

router.get('/jobs/:id/apply', showApplyPage);



router.post('/jobs', isAuthenticated, createNewJob);

router.get('/my-jobs', isAuthenticated, showMyJobs);


router.get('/jobs/:id/update', isAuthenticated, showUpdateJobPage);
router.post('/jobs/:id/update', isAuthenticated, updateExistingJob);


router.get('/jobs/:id/delete', isAuthenticated, deleteExistingJob);


router.get('/jobs/:id/applicants', isAuthenticated, showApplicants);


router.post('/apply/:id', uploadResume, submitApplication);

export default router;
