import mongoose from "mongoose";
import userModel from './user.js';
import dotenv from 'dotenv';

dotenv.config();
mongoose.set("debug", true);
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).catch((error) => console.log(error));
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas');
});

function getUsers(name, job) {
  let query = {};

  // If both name and job are provided, construct the query object with both conditions
  if (name && job) {
    query = { name: name, job: job };
  }
  // If only name is provided, add name condition to the query
  else if (name) {
    query = { name: name };
  }
  // If only job is provided, add job condition to the query
  else if (job) {
    query = { job: job };
  }

  try {
    // Use the find method with the constructed query to fetch users
    const users = userModel.find(query);
    return users;
  } catch (error) {
    throw error;
  }
}

function findUserById(id) {
  return userModel.findById(id);
}

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function findUserByName(name) {
  return userModel.find({ name: name });
}

function findUserByJob(job) {
  return userModel.find({ job: job });
}

function deleteUser(_id) {
  return userModel.findByIdAndDelete(_id);
}


export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUser,
};