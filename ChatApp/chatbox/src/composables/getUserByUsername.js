import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

// kullanıcıyı username ile almak için fonksiyon
export const getUserByUsername = async (username) => {
  try {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data(); 
    }
    return null; 
  } catch (error) {
    console.error('Error getting user by username:', error);
    return null; 
  }
};
