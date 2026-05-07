// ============================================================
// models/user.model.js
// Handles all user (recruiter) data using in-memory arrays
// NO DATABASE — data lives in RAM while server is running
// ============================================================

import { v4 as uuidv4 } from 'crypto'; // We'll use a simple ID generator

// ============================================================
// IN-MEMORY DATA STORE
// This array holds all registered recruiters
// It resets every time the server restarts (by design)
// ============================================================
let users = [
  // Pre-seeded demo recruiter for easy testing
  {
    id: 'demo-recruiter-1',
    name: 'Demo Recruiter',
    email: 'recruiter@demo.com',
    password: 'password123'  // In real apps, use bcrypt hashing
  }
];

// ============================================================
// getAllUsers()
// Returns the entire users array
// Used for: debugging, checking duplicates
// ============================================================
const getAllUsers = () => {
  return users;
};

// ============================================================
// getUserById(id)
// Find and return a user by their ID
// ============================================================
const getUserById = (id) => {
  return users.find(user => user.id === id);
};

// ============================================================
// getUserByEmail(email)
// Find and return a user by their email
// Used for: checking duplicates during registration, login lookup
// ============================================================
const getUserByEmail = (email) => {
  return users.find(user => user.email === email.toLowerCase());
};

// ============================================================
// addUser(userData)
// Creates a new recruiter and adds them to the in-memory array
// Returns the newly created user object
// ============================================================
const addUser = (userData) => {
  // Generate a unique ID using timestamp + random number
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    password: userData.password  // Plain text (college project — in production, hash this!)
  };

  users.push(newUser); // Add to our in-memory array
  return newUser;
};

// ============================================================
// loginUser(email, password)
// Checks if credentials match any stored user
// Returns the user object if valid, null if not
// ============================================================
const loginUser = (email, password) => {
  const user = getUserByEmail(email);

  // If user not found, return null
  if (!user) return null;

  // Compare passwords (plain text comparison for college project)
  if (user.password !== password) return null;

  // Credentials match — return user (without exposing password)
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
};

// Export all functions for use in controllers
export { getAllUsers, getUserById, getUserByEmail, addUser, loginUser };
