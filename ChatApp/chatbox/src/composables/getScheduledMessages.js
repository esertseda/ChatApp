import { ref } from 'vue';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getUsernameById } from '../utils/utils'; // kullanıcı adını almak için fonksiyon

const getScheduledMessages = () => {
  const messages = ref([]);
  const error = ref(null);
  const recipients = ref({}); 

  const collectionRef = collection(db, 'messages');
  const q = query(
    collectionRef,
    where('sendDate', '>', new Date()), // sadece gelecekteki tarihler için filtrele
    orderBy('sendDate', 'asc') // sırala
  );

  const unsubscribe = onSnapshot(
    q,
    async (snapshot) => {
      const results = [];
      const now = new Date();

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const sendDate = data.sendDate.toDate();

        if (sendDate > now) { 
         
          let recipientName = 'Bilinmeyen Kullanıcı';
          if (data.receiverId) {
            if (recipients.value[data.receiverId]) {
              recipientName = recipients.value[data.receiverId];
            } else {
              try {
                recipientName = await getUsernameById(data.receiverId);
                recipients.value[data.receiverId] = recipientName;
              } catch (error) {
                console.error('Alıcı adını alırken hata:', error);
              }
            }
          }

          results.push({
            id: doc.id,
            message: data.message,
            sendDate: sendDate,
            receiverName: recipientName 
          });
        }
      }

      messages.value = results;
      error.value = null;
    },
    (err) => {
      messages.value = [];
      error.value = 'Planlanmış mesajları alırken hata: ' + err.message;
    }
  );

  return { messages, error, unsubscribe };
};

export default getScheduledMessages;
