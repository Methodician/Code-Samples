// This ugly, ugly component demonstrates early mastery of the new react-firebase-hooks library's latest breaking changes
import React, { useEffect } from 'react';
import {
  useCollection,
  useCollectionData,
  useDocument,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import {
  useList,
  useListKeys,
  useListVals,
  useObject,
  useObjectVal,
} from 'react-firebase-hooks/database';

import {
  jobsRef,
  singleJobRef,
  usersRef,
  singleUserRef,
} from 'shared/services/firebase/firebaseRefs';

import styles from './App.scss';

const App = () => {
  const [
    jobsQuerySnapVal,
    jobsQuerySnapLoading,
    jobsQuerySnapError,
  ] = useCollection(jobsRef);
  const [jobsDocsVal, jobsDocsLoading, jobsDocsError] = useCollectionData(
    jobsRef
  );
  const [
    jobsDocsWithIdVal,
    jobsDocsWithIdLoading,
    jobsDocsWithIdError,
  ] = useCollectionData(jobsRef, { idField: 'jobID' });
  const [jobSnapVal, jobSnapLoading, jobSnapError] = useDocument(
    singleJobRef('R7dqbXNBkzJaA2GewIGG')
  );
  const [jobDataVal, jobDataLoading, jobDataError] = useDocumentData(
    singleJobRef('R7dqbXNBkzJaA2GewIGG')
  );
  const [usersListVal, usersListLoading, usersListError] = useList(usersRef);
  const [usersValsVal, usersValsLoading, usersValsError] = useListVals(
    usersRef
  );
  const [
    usersKeysAndValsVal,
    usersKeysAndValsLoading,
    usersKeysAndValsError,
  ] = useListVals(usersRef, { keyField: 'UserId' });
  const [usersKeysVal, usersKeysLoading, usersKeysError] = useListKeys(
    usersRef
  );
  const [userObjectVal, userObjectLoading, userObjectError] = useObject(
    singleUserRef('-LexNQspKAmaUzo9F1xN')
  );
  const [
    userObjectValVal,
    userObjectValLoading,
    userObjectValError,
  ] = useObjectVal(singleUserRef('-LexNQspKAmaUzo9F1xN'));

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(jobsDocsWithIdVal);
  }, [jobsDocsWithIdLoading]);

  return (
    <main className={styles.App}>
      <h1>This is Caregiver ADMIN.</h1>
      {/* Firestore collection samples */}
      <h1>Testing useCollection</h1>
      <h2>error: {jobsQuerySnapError}</h2>
      <h2>loading: {jobsQuerySnapLoading}</h2>
      <>
        {jobsQuerySnapVal &&
          jobsQuerySnapVal.docs.map(doc => (
            <p key={doc.id}>{JSON.stringify(doc.data())}</p>
          ))}
      </>
      <h1>Testing useCollectionData</h1>
      <h2>error: {jobsDocsError}</h2>
      <h2>loading: {jobsDocsLoading}</h2>
      <>
        {jobsDocsVal &&
          jobsDocsVal.map((doc, id) => <p key={id}>{JSON.stringify(doc)}</p>)}
      </>

      <h1>Testing useCollectionData + Id field</h1>
      <h2>error: {jobsDocsWithIdError}</h2>
      <h2>loading: {jobsDocsWithIdLoading}</h2>
      {jobsDocsWithIdVal &&
        jobsDocsWithIdVal.map((doc, id) => (
          <p key={id}>{JSON.stringify(doc)}</p>
        ))}
      {/* Firestore doc samples */}
      <h1>Testing single useDocument:</h1>
      <p>error: {jobSnapError}</p>
      <p>loading: {jobSnapLoading}</p>
      <p>{jobSnapVal && JSON.stringify(jobSnapVal.data())}</p>
      <h1>Testing single useDocumentData:</h1>
      <p>error: {jobDataError}</p>
      <p>loading: {jobDataLoading}</p>
      <p>{jobDataVal && JSON.stringify(jobDataVal)}</p>
      {/* RTDB list samples */}
      <h1>Testing useList</h1>
      <h2>error: {usersListError}</h2>
      <h2>loading: {usersListLoading}</h2>
      <>
        {usersListVal &&
          usersListVal.map(snap => (
            <p key={snap.key}>{JSON.stringify(snap.val())}</p>
          ))}
      </>
      <h1>Testing useListVals</h1>
      <h2>error: {usersValsError}</h2>
      <h2>loading: {usersValsLoading}</h2>
      <>
        {usersValsVal &&
          usersValsVal.map((val, dex) => (
            <p key={dex}>{JSON.stringify(val)}</p>
          ))}
      </>
      <h1>Testing useListValsWithKeys</h1>
      <h2>error: {usersKeysAndValsError}</h2>
      <h2>loading: {usersKeysAndValsLoading}</h2>
      <>
        {usersKeysAndValsVal &&
          usersKeysAndValsVal.map(val => (
            <p key={val.UserId}>{JSON.stringify(val)}</p>
          ))}
      </>
      <h1>Testing userKeys</h1>
      <h2>error: {usersKeysError}</h2>
      <h2>loading: {usersKeysLoading}</h2>
      <>
        {usersKeysVal &&
          usersKeysVal.map(key => <p key={key}>{JSON.stringify(key)}</p>)}
      </>
      {/* RTDB Object samples */}
      <h1>Testing single useObject:</h1>
      <p>error: {userObjectError}</p>
      <p>loading: {userObjectLoading}</p>
      <p>{userObjectVal && JSON.stringify(userObjectVal.val())}</p>
      <h1>Testing single useObjectVal:</h1>
      <p>error: {userObjectValError}</p>
      <p>loading: {userObjectValLoading}</p>
      <p>{userObjectValVal && JSON.stringify(userObjectValVal)}</p>
    </main>
  );
};

export default App;
