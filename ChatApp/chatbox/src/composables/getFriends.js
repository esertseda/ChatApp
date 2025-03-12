import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getFriends = async (userId) => {
  const q = query(collection(db, 'friends'), where('user1', '==', userId));
  const querySnapshot = await getDocs(q);
  const friends = [];
  querySnapshot.forEach((doc) => {
    friends.push(doc.data());
  });
  return friends;
};
