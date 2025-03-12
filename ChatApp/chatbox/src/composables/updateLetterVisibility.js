import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const updateLetterVisibility = async (letterId) => {
  try {
    const letterRef = doc(db, 'letters', letterId);
    await updateDoc(letterRef, { isVisible: true });
    console.log('Letter visibility updated.');
  } catch (error) {
    console.error('Error updating visibility:', error);
  }
};
