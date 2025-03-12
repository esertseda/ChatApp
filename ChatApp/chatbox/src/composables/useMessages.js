import { ref } from 'vue';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useMessages() {
  const messages = ref([]);

  // Mesajları tarihe göre sıralayarak çek
  const updateMessages = async () => {
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc') 
    );

    try {
      const querySnapshot = await getDocs(q);
      messages.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

 
  const addMessage = async (userId, message, chatType, receiverId) => {
    try {
      await addDoc(collection(db, 'messages'), {
        createdAt: serverTimestamp(), 
        updatedAt: serverTimestamp(),
        user: userId,
        message,
        chatType,
        receiverId
      });
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  return { updateMessages, addMessage, messages };
}
