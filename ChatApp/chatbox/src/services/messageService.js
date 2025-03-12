import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config'; 

export const sendScheduledMessages = async () => {
  const now = new Date();
  const colRef = collection(db, 'messages');
  
  const q = query(colRef, where('sendDate', '<=', now), where('isSent', '==', false));
  
  const querySnapshot = await getDocs(q);
  
  querySnapshot.forEach(async (doc) => {
    const messageData = doc.data();

    console.log('Sending message:', messageData.message);

    await updateDoc(doc.ref, { isSent: true });
  });
};

setInterval(sendScheduledMessages, 60000)

export const updateMessagesWithNewFields = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'messages'));

    querySnapshot.forEach(async (docSnapshot) => {
      const docRef = doc(db, 'messages', docSnapshot.id);
      await updateDoc(docRef, {
        receiverId: 'defaultReceiverId', 
        chatType: 'individual' 
      });
    });

    console.log('All messages updated successfully!');
  } catch (error) {
    console.error('Error updating messages:', error);
  }
};
