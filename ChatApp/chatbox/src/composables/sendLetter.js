import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { updateLetterVisibility } from './updateLetterVisibility';
import { auth } from '../firebase/config';
const sendLetter = async (senderId, letterContent, sendDate) => {
  const now = new Date();
  
 
  const delay = new Date(sendDate).getTime() - now.getTime();

  const letterData = {
    letterContent: letterContent,
    sendDate: Timestamp.fromDate(new Date(sendDate)), 
    senderId: senderId,
    isSent: delay <= 0, 
    isVisible: delay <= 0,
    creationDate: Timestamp.now(), 
  };

  try {
    const docRef = await addDoc(collection(db, 'letters'), letterData);
    console.log('Letter sent successfully:', letterData);

    if (delay > 0) {
      setTimeout(async () => {
        await updateLetterVisibility(docRef.id); 
      }, delay);
    }
  } catch (error) {
    console.error('Error sending letter:', error);
  }
};


export default sendLetter;
