
<template>
  <div class="chat-window">
    <div v-for="message in messages" :key="message.id" class="message-item">
      <div class="message-date">{{ message.sendDate.toLocaleString() }}</div>
      <p class="message-text">
        <strong>{{ message.username }}:</strong> {{ message.message }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { collection, query, where, onSnapshot, and, or } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { getUsernameById } from '../utils/utils'; 

export default {
  name: 'ChatWindow',
  props: ['receiverId'],
  setup(props) {
    const messages = ref([]);
    const userCache = ref({}); 

    const fetchUsername = async (uid) => {
      if (userCache.value[uid]) {
        return userCache.value[uid];
      }
      const username = await getUsernameById(uid);
      userCache.value[uid] = username;
      return username;
    };

    const loadMessages = () => {
      if (props.receiverId) {
        const uid = auth.currentUser.uid;

        const q = query(
          collection(db, 'messages'),
          and(
            where('chatType', '==', 'individual'),
            or(
              and(
                where('user', '==', uid),
                where('receiverId', '==', props.receiverId)
              ),
              and(
                where('user', '==', props.receiverId),
                where('receiverId', '==', uid)
              )
            )
          )
        );

        onSnapshot(q, async (querySnapshot) => {
          const messagesList = [];
          const now = new Date();

          for (const doc of querySnapshot.docs) {
            const messageData = doc.data();
            const sendDate = messageData.sendDate.toDate();

            if (sendDate <= now || messageData.isSent) {
              const username = await fetchUsername(messageData.user);

              messagesList.push({
                id: doc.id,
                message: messageData.message,
                username: username,
                sendDate: sendDate,
                isSent: messageData.isSent
              });
            }
          }

          messagesList.sort((a, b) => a.sendDate - b.sendDate);

          messages.value = messagesList;
        }, (error) => {
          console.error('Error loading messages:', error);
        });
      }
    };

    watch(() => props.receiverId, loadMessages, { immediate: true });

    return {
      messages
    };
  },
};
</script>

<style scoped>
.chat-window {
  padding: 20px;
  border: 1px solid #ddd;
  height: 300px;
  overflow-y: scroll;
  text-align: left;
}

.message-item {
  margin-bottom: 5px;
}

.message-date {
  font-size: 0.8em;
  color: #888;
  margin-bottom: 2px;
}
.message-text {
  margin-top: 0; 
  color:black
}
</style>