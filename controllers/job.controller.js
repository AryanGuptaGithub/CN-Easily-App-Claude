
import {
  getAllJobs,
  getJobById,
  getJobsByRecruiter,
  createJob,
  updateJob,
  deleteJob,
  addApplicant,
  getApplicantsByJob
} from '../models/job.model.js';

import { sendApplicationConfirmation } from '../config/mailer.js';

// Job categories for dropdowns
const JOB_CATEGORIES = [
  'Technology', 'Design', 'Marketing', 'Finance', 'Sales',
  'Human Resources', 'Operations', 'Customer Support', 'Legal', 'Other'
];


const showLandingPage = (req, res) => {
  const allJobs = getAllJobs();


  const featuredJobs = allJobs.slice(-3).reverse();


  const stats = {
    totalJobs: allJobs.length,
    totalCompanies: [...new Set(allJobs.map(j => j.companyname))].length,
    totalCategories: [...new Set(allJobs.map(j => j.jobcategory))].length
  };

  res.render('pages/index', {
    title: 'Job Portal — Find Your Dream Job',
    featuredJobs,
    stats,
    categories: JOB_CATEGORIES
  });
};


const showAllJobs = (req, res) => {
  let allJobs = getAllJobs();


  const { search, category, location, page } = req.query;


  if (search && search.trim() !== '') {
    const term = search.toLowerCase().trim();
    allJobs = allJobs.filter(job =>
      job.jobdesignation.toLowerCase().includes(term) ||
      job.companyname.toLowerCase().includes(term) ||
      job.jobcategory.toLowerCase().includes(term) ||
      job.joblocation.toLowerCase().includes(term)
    );
  }


  if (category && category !== 'all') {
    allJobs = allJobs.filter(job =>
      job.jobcategory.toLowerCase() === category.toLowerCase()
    );
  }


  if (location && location.trim() !== '') {
    const loc = location.toLowerCase().trim();
    allJobs = allJobs.filter(job =>
      job.joblocation.toLowerCase().includes(loc)
    );
  }


  const JOBS_PER_PAGE = 6; 
  const currentPage = parseInt(page) || 1;
  const totalJobs = allJobs.length;
  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);


  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const paginatedJobs = allJobs.slice(startIndex, startIndex + JOBS_PER_PAGE);

  
  const availableCategories = [...new Set(getAllJobs().map(j => j.jobcategory))];

  res.render('pages/jobs', {
    title: 'Browse Jobs',
    jobs: paginatedJobs,
    totalJobs,
    currentPage,
    totalPages,
    search: search || '',
    category: category || 'all',
    location: location || '',
    categories: availableCategories,
    JOB_CATEGORIES
  });
};



const showJobDetails = (req, res) => {
  const job = getJobById(req.params.id);

  if (!job) {
    return res.status(404).render('pages/404', {
      title: 'Job Not Found',
      message: 'The job you are looking for does not exist or has been removed.'
    });
  }

  res.render('pages/job-details', {
    title: `${job.jobdesignation} at ${job.companyname}`,
    job
  });
};



const showCreateJobPage = (req, res) => {
  res.render('pages/create-job', {
    title: 'Post a New Job',
    categories: JOB_CATEGORIES,
    errors: [],
    formData: {}
  });
};



const createNewJob = (req, res) => {
  const { jobcategory, jobdesignation, joblocation, companyname,
          salary, applyby, skillsrequired, numberofopenings, jobdescription } = req.body;

  const errors = [];
  const formData = req.body;

  // --- Validation ---
  if (!jobcategory) errors.push('Job category is required');
  if (!jobdesignation || jobdesignation.trim().length < 3) errors.push('Job title must be at least 3 characters');
  if (!joblocation || joblocation.trim() === '') errors.push('Job location is required');
  if (!companyname || companyname.trim() === '') errors.push('Company name is required');
  if (!salary || salary.trim() === '') errors.push('Salary range is required');
  if (!applyby) errors.push('Application deadline is required');
  else {
    const applyDate = new Date(applyby);
    if (isNaN(applyDate) || applyDate < new Date()) {
      errors.push('Apply by date must be a future date');
    }
  }
  if (!skillsrequired || skillsrequired.trim() === '') errors.push('Skills required field cannot be empty');
  if (!numberofopenings || parseInt(numberofopenings) < 1) errors.push('Number of openings must be at least 1');

  if (errors.length > 0) {
    return res.render('pages/create-job', {
      title: 'Post a New Job',
      categories: JOB_CATEGORIES,
      errors,
      formData
    });
  }

  // Create the job in model
  const newJob = createJob(
    req.body,
    req.session.recruiter.id,
    req.session.recruiter.name
  );

  req.session.successMsg = `Job "${newJob.jobdesignation}" posted successfully!`;
  res.redirect(`/jobs/${newJob.id}`);
};



const showUpdateJobPage = (req, res) => {
  const job = getJobById(req.params.id);

  if (!job) {
    return res.status(404).render('pages/404', { title: 'Job Not Found' });
  }

  // Authorization: only the job creator can edit
  if (job.recruiterId !== req.session.recruiter.id) {
    req.session.errorMsg = 'You are not authorized to edit this job.';
    return res.redirect(`/jobs/${job.id}`);
  }

  res.render('pages/update-job', {
    title: `Edit: ${job.jobdesignation}`,
    job,
    categories: JOB_CATEGORIES,
    errors: [],
    formData: job 
  });
};



const updateExistingJob = (req, res) => {
  const job = getJobById(req.params.id);

  if (!job) {
    return res.status(404).render('pages/404', { title: 'Job Not Found' });
  }

  // Authorization check
  if (job.recruiterId !== req.session.recruiter.id) {
    req.session.errorMsg = 'You are not authorized to update this job.';
    return res.redirect(`/jobs/${job.id}`);
  }

  const errors = [];
  const formData = req.body;


  if (!formData.jobcategory) errors.push('Job category is required');
  if (!formData.jobdesignation || formData.jobdesignation.trim().length < 3) errors.push('Job title must be at least 3 characters');
  if (!formData.joblocation || formData.joblocation.trim() === '') errors.push('Job location is required');
  if (!formData.companyname || formData.companyname.trim() === '') errors.push('Company name is required');
  if (!formData.salary || formData.salary.trim() === '') errors.push('Salary range is required');
  if (!formData.applyby) errors.push('Application deadline is required');
  if (!formData.skillsrequired || formData.skillsrequired.trim() === '') errors.push('Skills required cannot be empty');
  if (!formData.numberofopenings || parseInt(formData.numberofopenings) < 1) errors.push('At least 1 opening required');

  if (errors.length > 0) {
    return res.render('pages/update-job', {
      title: `Edit: ${job.jobdesignation}`,
      job,
      categories: JOB_CATEGORIES,
      errors,
      formData
    });
  }

  const result = updateJob(req.params.id, req.body, req.session.recruiter.id);

  if (!result) {
    req.session.errorMsg = 'Failed to update job. Please try again.';
    return res.redirect(`/jobs/${req.params.id}`);
  }

  req.session.successMsg = 'Job updated successfully!';
  res.redirect(`/jobs/${req.params.id}`);
};


const deleteExistingJob = (req, res) => {
  const job = getJobById(req.params.id);

  if (!job) {
    req.session.errorMsg = 'Job not found.';
    return res.redirect('/jobs');
  }

  // Authorization check
  if (job.recruiterId !== req.session.recruiter.id) {
    req.session.errorMsg = 'You are not authorized to delete this job.';
    return res.redirect(`/jobs/${job.id}`);
  }

  const result = deleteJob(req.params.id, req.session.recruiter.id);

  if (result === true) {
    req.session.successMsg = `Job "${job.jobdesignation}" has been deleted.`;
  } else {
    req.session.errorMsg = 'Failed to delete the job.';
  }

  res.redirect('/jobs');
};


const showApplyPage = (req, res) => {
  const job = getJobById(req.params.id);

  if (!job) {
    return res.status(404).render('pages/404', {
      title: 'Job Not Found',
      message: 'The job you are looking for does not exist.'
    });
  }

  res.render('pages/apply', {
    title: `Apply for ${job.jobdesignation}`,
    job,
    errors: [],
    formData: {}
  });
};


const submitApplication = async (req, res) => {
  const job = getJobById(req.params.id);

  if (!job) {
    return res.status(404).render('pages/404', { title: 'Job Not Found' });
  }

  const { name, email, contact } = req.body;
  const errors = [];
  const formData = { name, email, contact };

  // --- Validation ---
  if (!name || name.trim().length < 2) errors.push('Full name must be at least 2 characters');
  if (!email || !email.includes('@')) errors.push('Please enter a valid email address');
  if (!contact || contact.trim().length < 10) errors.push('Contact number must be at least 10 digits');
  if (!req.file) errors.push('Resume (PDF) is required');

  // Check for duplicate application (same email for same job)
  const existingApplicant = job.applicants.find(a => a.email === email?.toLowerCase().trim());
  if (existingApplicant) {
    errors.push('You have already applied for this job with this email address.');
  }

  if (errors.length > 0) {
    return res.render('pages/apply', {
      title: `Apply for ${job.jobdesignation}`,
      job,
      errors,
      formData
    });
  }


  const result = addApplicant(req.params.id, {
    name,
    email,
    contact,
    resumePath: req.file ? req.file.path : null
  });

  if (!result) {
    req.session.errorMsg = 'Application submission failed. Please try again.';
    return res.redirect(`/jobs/${req.params.id}/apply`);
  }


  try {
    await sendApplicationConfirmation({
      to: email,
      applicantName: name,
      jobTitle: job.jobdesignation,
      companyName: job.companyname
    });
  } catch (emailError) {

    console.error('Email sending failed:', emailError.message);
  }

  req.session.successMsg = `Application submitted successfully! A confirmation email has been sent to ${email}.`;
  res.redirect(`/jobs/${req.params.id}`);
};

const showApplicants = (req, res) => {
  const job = getJobById(req.params.id);

  if (!job) {
    return res.status(404).render('pages/404', { title: 'Job Not Found' });
  }


  if (job.recruiterId !== req.session.recruiter.id) {
    req.session.errorMsg = 'You are not authorized to view applicants for this job.';
    return res.redirect(`/jobs/${job.id}`);
  }


  const APPLICANTS_PER_PAGE = 10;
  const currentPage = parseInt(req.query.page) || 1;
  const allApplicants = job.applicants;
  const totalApplicants = allApplicants.length;
  const totalPages = Math.ceil(totalApplicants / APPLICANTS_PER_PAGE);
  const startIndex = (currentPage - 1) * APPLICANTS_PER_PAGE;
  const paginatedApplicants = allApplicants.slice(startIndex, startIndex + APPLICANTS_PER_PAGE);

  res.render('pages/applicants', {
    title: `Applicants for ${job.jobdesignation}`,
    job,
    applicants: paginatedApplicants,
    totalApplicants,
    currentPage,
    totalPages
  });
};



const showMyJobs = (req, res) => {
  const myJobs = getJobsByRecruiter(req.session.recruiter.id);

  res.render('pages/my-jobs', {
    title: 'My Posted Jobs',
    jobs: myJobs
  });
};

export {
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
};
