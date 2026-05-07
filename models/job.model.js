// ============================================================
// models/job.model.js
// Handles all job and applicant data using in-memory arrays
// This is the core data layer of the Job Portal
// ============================================================

// ============================================================
// IN-MEMORY DATA STORE
// Pre-seeded with sample jobs so the app looks populated
// when you first run it — great for demos and presentations
// ============================================================
let jobs = [
  {
    id: 'job_seed_1',
    jobcategory: 'Technology',
    jobdesignation: 'Frontend Developer',
    joblocation: 'Bangalore, Karnataka',
    companyname: 'TechCorp India',
    salary: '8,00,000 - 12,00,000',
    applyby: '2025-12-31',
    skillsrequired: ['HTML', 'CSS', 'JavaScript', 'React'],
    numberofopenings: 3,
    jobdescription: 'We are looking for a talented Frontend Developer to join our growing team. You will be responsible for building user-facing features and ensuring excellent user experience.',
    jobposted: new Date('2025-06-01').toISOString(),
    recruiterId: 'demo-recruiter-1',
    recruiterName: 'Demo Recruiter',
    applicants: []
  },
  {
    id: 'job_seed_2',
    jobcategory: 'Technology',
    jobdesignation: 'Backend Engineer',
    joblocation: 'Mumbai, Maharashtra',
    companyname: 'DataSoft Solutions',
    salary: '10,00,000 - 18,00,000',
    applyby: '2025-12-15',
    skillsrequired: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
    numberofopenings: 2,
    jobdescription: 'Join our backend team to build scalable APIs and microservices. You should have strong knowledge of Node.js and database design.',
    jobposted: new Date('2025-06-05').toISOString(),
    recruiterId: 'demo-recruiter-1',
    recruiterName: 'Demo Recruiter',
    applicants: []
  },
  {
    id: 'job_seed_3',
    jobcategory: 'Design',
    jobdesignation: 'UI/UX Designer',
    joblocation: 'Hyderabad, Telangana',
    companyname: 'Creative Minds Studio',
    salary: '6,00,000 - 9,00,000',
    applyby: '2025-11-30',
    skillsrequired: ['Figma', 'Adobe XD', 'Wireframing', 'User Research'],
    numberofopenings: 1,
    jobdescription: 'We need a creative UI/UX Designer to craft beautiful and intuitive interfaces. Portfolio required.',
    jobposted: new Date('2025-06-10').toISOString(),
    recruiterId: 'demo-recruiter-1',
    recruiterName: 'Demo Recruiter',
    applicants: []
  },
  {
    id: 'job_seed_4',
    jobcategory: 'Marketing',
    jobdesignation: 'Digital Marketing Manager',
    joblocation: 'Delhi, NCR',
    companyname: 'GrowthHub Agency',
    salary: '7,00,000 - 11,00,000',
    applyby: '2025-11-20',
    skillsrequired: ['SEO', 'SEM', 'Google Analytics', 'Content Strategy'],
    numberofopenings: 2,
    jobdescription: 'Drive our digital marketing campaigns and grow our online presence. Experience with paid campaigns required.',
    jobposted: new Date('2025-06-12').toISOString(),
    recruiterId: 'demo-recruiter-1',
    recruiterName: 'Demo Recruiter',
    applicants: []
  },
  {
    id: 'job_seed_5',
    jobcategory: 'Finance',
    jobdesignation: 'Financial Analyst',
    joblocation: 'Pune, Maharashtra',
    companyname: 'FinEdge Consultants',
    salary: '9,00,000 - 14,00,000',
    applyby: '2025-12-10',
    skillsrequired: ['Excel', 'Financial Modeling', 'Power BI', 'Accounting'],
    numberofopenings: 4,
    jobdescription: 'Analyze financial data, prepare reports, and support business decisions. CA or MBA Finance preferred.',
    jobposted: new Date('2025-06-15').toISOString(),
    recruiterId: 'demo-recruiter-1',
    recruiterName: 'Demo Recruiter',
    applicants: []
  }
];

// ============================================================
// getAllJobs()
// Returns the full list of all jobs
// ============================================================
const getAllJobs = () => {
  return jobs;
};

// ============================================================
// getJobById(id)
// Finds and returns a single job by its ID
// Returns undefined if not found
// ============================================================
const getJobById = (id) => {
  return jobs.find(job => job.id === id);
};

// ============================================================
// getJobsByRecruiter(recruiterId)
// Returns all jobs posted by a specific recruiter
// Used in the recruiter dashboard
// ============================================================
const getJobsByRecruiter = (recruiterId) => {
  return jobs.filter(job => job.recruiterId === recruiterId);
};

// ============================================================
// createJob(jobData, recruiterId, recruiterName)
// Creates a new job and adds it to the array
// Returns the newly created job
// ============================================================
const createJob = (jobData, recruiterId, recruiterName) => {
  // Convert skillsrequired from comma-separated string to array
  let skills = jobData.skillsrequired;
  if (typeof skills === 'string') {
    skills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  const newJob = {
    id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    jobcategory: jobData.jobcategory.trim(),
    jobdesignation: jobData.jobdesignation.trim(),
    joblocation: jobData.joblocation.trim(),
    companyname: jobData.companyname.trim(),
    salary: jobData.salary.trim(),
    applyby: jobData.applyby,
    skillsrequired: skills,
    numberofopenings: parseInt(jobData.numberofopenings) || 1,
    jobdescription: jobData.jobdescription ? jobData.jobdescription.trim() : '',
    jobposted: new Date().toISOString(), // Timestamp of when job was posted
    recruiterId: recruiterId,
    recruiterName: recruiterName,
    applicants: [] // Empty applicants array initially
  };

  jobs.push(newJob);
  return newJob;
};

// ============================================================
// updateJob(id, updatedData, recruiterId)
// Finds the job and updates its fields
// Only the job owner can update
// Returns updated job or null if not found/unauthorized
// ============================================================
const updateJob = (id, updatedData, recruiterId) => {
  const jobIndex = jobs.findIndex(job => job.id === id);

  // Job not found
  if (jobIndex === -1) return null;

  // Authorization check: only owner can update
  if (jobs[jobIndex].recruiterId !== recruiterId) return false;

  // Convert skills if string
  let skills = updatedData.skillsrequired;
  if (typeof skills === 'string') {
    skills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
  }

  // Update only the editable fields, keep id, recruiterId, applicants intact
  jobs[jobIndex] = {
    ...jobs[jobIndex],            // Keep existing fields
    jobcategory: updatedData.jobcategory.trim(),
    jobdesignation: updatedData.jobdesignation.trim(),
    joblocation: updatedData.joblocation.trim(),
    companyname: updatedData.companyname.trim(),
    salary: updatedData.salary.trim(),
    applyby: updatedData.applyby,
    skillsrequired: skills,
    numberofopenings: parseInt(updatedData.numberofopenings) || 1,
    jobdescription: updatedData.jobdescription ? updatedData.jobdescription.trim() : ''
  };

  return jobs[jobIndex];
};

// ============================================================
// deleteJob(id, recruiterId)
// Removes a job from the array
// Only the owner can delete
// Returns true if deleted, false if unauthorized, null if not found
// ============================================================
const deleteJob = (id, recruiterId) => {
  const jobIndex = jobs.findIndex(job => job.id === id);

  if (jobIndex === -1) return null;            // Job not found
  if (jobs[jobIndex].recruiterId !== recruiterId) return false; // Unauthorized

  jobs.splice(jobIndex, 1); // Remove 1 element at jobIndex
  return true;
};

// ============================================================
// addApplicant(jobId, applicantData)
// Adds an applicant to a specific job's applicants array
// Returns the updated job or null if not found
// ============================================================
const addApplicant = (jobId, applicantData) => {
  const job = getJobById(jobId);
  if (!job) return null;

  const newApplicant = {
    applicantId: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: applicantData.name.trim(),
    email: applicantData.email.toLowerCase().trim(),
    contact: applicantData.contact.trim(),
    resumePath: applicantData.resumePath || null,
    appliedAt: new Date().toISOString()
  };

  job.applicants.push(newApplicant);
  return { job, applicant: newApplicant };
};

// ============================================================
// getApplicantsByJob(jobId)
// Returns all applicants for a specific job
// ============================================================
const getApplicantsByJob = (jobId) => {
  const job = getJobById(jobId);
  if (!job) return null;
  return job.applicants;
};

// Export all model functions
export {
  getAllJobs,
  getJobById,
  getJobsByRecruiter,
  createJob,
  updateJob,
  deleteJob,
  addApplicant,
  getApplicantsByJob
};
