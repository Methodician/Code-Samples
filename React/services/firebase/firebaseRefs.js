// This file demonstrates a clean, composable way to store and organize Firebase reference generators for consumption by services or components.
// In practice each "list" would contain many reference generators
// It's also a place I've made heavy use of JSDoc to provide TypeScript-like intellisense and code completion in JavaScript projects (VSCode only)
import { rtdb, fsdb, storage } from './firebase';

// REAL TIME DATABASE LIST REFS
/**
 * collection of all users
 */
export const usersRef = rtdb.ref('users');

// REAL TIME DATABASE OBJECT REFS
/**
 * Takes a user's ID and returns a single user object reference
 * @param {string} userId
 */
export const singleUserRef = userId => usersRef.child(userId);

// FIRESTORE COLLECTION REFERENCES
/**
 * Queryable reference to all the jobs
 */
export const jobsRef = fsdb.collection('jobs');

// FIRESTORE DOCUMENT REFERENCES
/**
 * Takes a job ID and returns a document reference
 * @param {string} jobId
 */
export const singleJobRef = jobId => jobsRef.doc(jobId);

// STORAGE REFS
/**
 * Reference to all the profile images in the database
 */
export const profileImagesRef = storage.ref('profileImages');

/**
 * Reference to an individual user's profile image storage ref.
 * @param {string} userId
 */
export const singleProfileImageRef = userId => profileImagesRef.child(userId);
