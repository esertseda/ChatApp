import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase/config'; 

const updateAllMessages = async (newReceiverId) => {
  try {

    const querySnapshot = await getDocs(collection(db, 'messages'));
    
  
    querySnapshot.forEach(async (docSnapshot) => {
      const docRef = doc(db, 'messages', docSnapshot.id);
      await updateDoc(docRef, {
        receiverId: newReceiverId 
      });
    });

    console.log('All messages updated successfully!');
  } catch (error) {
    console.error('Error updating messages:', error);
  }
};

updateAllMessages('someReceiverId');
