import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getUsernameById = async (userId) => {
  if (!userId) {
    console.error('No userId provided');
    return 'Unknown User';
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      if (userData && userData.username) {
        return userData.username;
      } else {
        console.error(`No username found for uid: ${userId}`);
        return 'Unknown User';
      }
    } else {
      console.error(`No user found for uid: ${userId}`);
      return 'Unknown User';
    }
  } catch (error) {
    console.error('Error getting username:', error);
    return 'Unknown User';
  }
};
