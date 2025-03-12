import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const fixSenderIds = async () => {
  try {
    const colRef = collection(db, 'letters');
    const q = query(colRef, where('senderId', '==', 'uid'));
    
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (docSnapshot) => {
      const docRef = doc(db, 'letters', docSnapshot.id);
      const correctSenderId = auth.currentUser.uid; 

      await updateDoc(docRef, { senderId: correctSenderId });
      console.log(`Updated senderId for document ${docSnapshot.id}`);
    });

    console.log('All letters updated successfully!');
  } catch (error) {
    console.error('Error updating letters:', error);
  }
};

export default fixSenderIds;  
