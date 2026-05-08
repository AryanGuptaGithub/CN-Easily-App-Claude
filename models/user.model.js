

import { v4 as uuidv4 } from 'uuid';


let users = [

  {
    id: 'demo-recruiter-1',
    name: 'Demo Recruiter',
    email: 'recruiter@demo.com',
    password: 'password123'  
  }
];


const getAllUsers = () => {
  return users;
};

const getUserById = (id) => {
  return users.find(user => user.id === id);
};


const getUserByEmail = (email) => {
  return users.find(user => user.email === email.toLowerCase());
};


const addUser = (userData) => {

  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    password: userData.password  
  };

  users.push(newUser); 
  return newUser;
};


const loginUser = (email, password) => {
  const user = getUserByEmail(email);

 
  if (!user) return null;

 
  if (user.password !== password) return null;

 
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
};


export { getAllUsers, getUserById, getUserByEmail, addUser, loginUser };
