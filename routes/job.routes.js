// ============================================================
// routes/job.routes.js
// Defines all job and applicant related routes
// Some routes are protected by auth middleware
// ============================================================

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

// ============================================================
// PUBLIC ROUTES — No login required
// ============================================================

// Landing page
router.get('/', showLandingPage);

// All jobs (with search + filter + pagination)
router.get('/jobs', showAllJobs);

// IMPORTANT: /jobs/new must come BEFORE /jobs/:id
// Otherwise Express will treat "new" as an id
router.get('/jobs/new', isAuthenticated, showCreateJobPage);

// Job details page
router.get('/jobs/:id', showJobDetails);

// Apply page (form)
router.get('/jobs/:id/apply', showApplyPage);

// ============================================================
// PROTECTED ROUTES — Must be logged in
// isAuthenticated middleware checks req.session.recruiter
// ============================================================

// Create job (POST)
router.post('/jobs', isAuthenticated, createNewJob);

// My jobs dashboard
router.get('/my-jobs', isAuthenticated, showMyJobs);

// Update job (GET = show form, POST = process form)
router.get('/jobs/:id/update', isAuthenticated, showUpdateJobPage);
router.post('/jobs/:id/update', isAuthenticated, updateExistingJob);

// Delete job
router.get('/jobs/:id/delete', isAuthenticated, deleteExistingJob);

// View applicants (recruiter only, authorization done in controller)
router.get('/jobs/:id/applicants', isAuthenticated, showApplicants);

// Submit application — uses uploadResume Multer middleware
// uploadResume runs before submitApplication
router.post('/apply/:id', uploadResume, submitApplication);

export default router;
