// This file contains one example React-style Firebase service method for adding a "job" to Firestore
/* eslint-disable quotes */
import { jobsRef } from '../firebase/firebaseRefs';
import { fsTimestamp } from '../firebase/firebase';

/**
 * Takes a new job and adds it to the database.
 * Returns a reference to that job just in case...
 * @param {Object} job a job object
 */
export const addJob = async job => {
  const jobStart = new Date(job.startTime);
  const jobEnd = new Date(job.endTime);
  job.startTime = fsTimestamp.fromDate(jobStart);
  job.endTime = fsTimestamp.fromDate(jobEnd);
  try {
    const ref = await jobsRef.add(job);
    return ref;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("couldn't add the job", error);
  }
};
