
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const addFriend = async (user1Id, user2Id) => {
  try {
    await addDoc(collection(db, 'friends'), {
      user1: user1Id,
      user2: user2Id,
      status: 'pending' 
    });
    console.log('Friend request sent successfully!');
  } catch (error) {
    console.error('Error adding friend:', error);
  }
};
