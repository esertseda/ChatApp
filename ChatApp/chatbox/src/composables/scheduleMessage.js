import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const scheduleMessage = async (sendDate, chat) => {
  const now = new Date();
  const delay = sendDate - now;

  if (delay > 0) {
    try {
      // mesajı planlanmış olarak ekle
      await addDoc(collection(db, 'messages'), {
        ...chat,
        sendDate: Timestamp.fromDate(sendDate),
        isSent: false,
      });

      // ileri tarihli mesaj
      setTimeout(async () => {
        try {
          await addDoc(collection(db, 'messages'), {
            ...chat,
            sendDate: Timestamp.fromDate(sendDate),
            isSent: true,
          });
        } catch (error) {
          console.error('Error sending message after delay:', error);
        }
      }, delay);

    } catch (error) {
      console.error('Error scheduling message:', error);
    }

  } else {
    try {
      // anında mesaj gönderimi
      await addDoc(collection(db, 'messages'), {
        ...chat,
        sendDate: Timestamp.fromDate(now),
        isSent: true,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};

export default scheduleMessage;
