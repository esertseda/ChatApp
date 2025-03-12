import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const app = initializeApp({
 
});
const db = getFirestore(app);

const sendScheduledMessages = async () => {
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

setInterval(sendScheduledMessages, 60000); 
