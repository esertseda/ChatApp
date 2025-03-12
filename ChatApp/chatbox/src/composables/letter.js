import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const sendLetter = async (sendDate, letterContent) => {
  const now = new Date();
  const delay = sendDate - now;

  const letterData = {
    letter: letterContent,
    sendDate: Timestamp.fromDate(sendDate),
    isSent: false,
  };

  try {
    
    if (delay <= 0) {
      await addDoc(collection(db, 'letters'), {
        ...letterData,
        sendDate: Timestamp.fromDate(now), 
        isSent: true,
      });
    } else {
    
      await addDoc(collection(db, 'letters'), letterData);

      setTimeout(async () => {
        try {
          
          const querySnapshot = await collection(db, 'letters').where('sendDate', '==', Timestamp.fromDate(sendDate)).get();
          querySnapshot.forEach(async (doc) => {
            await doc.ref.update({ isSent: true });
          });
        } catch (error) {
          console.error('Error updating letter after delay:', error);
        }
      }, delay);
    }
  } catch (error) {
    console.error('Error sending letter:', error);
  }
};

export default sendLetter;
