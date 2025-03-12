<template>
  <div class="chat-form">
    <form @submit.prevent="sendMessage">
      <input v-model="message" placeholder="Type your message here..." required/>
      <input type="datetime-local" v-model="sendDate" />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { auth, db } from '../firebase/config';
import { addDoc, collection } from 'firebase/firestore';

export default {
  name: 'ChatForm',
  props: ['receiverId'],

  setup(props) {
    const message = ref('');
    const sendDate = ref('');
    const user = ref(null);

    auth.onAuthStateChanged((currentUser) => {
      user.value = currentUser;
    });

    const sendMessage = async () => {
      if (user.value && props.receiverId) {
        try {
          const now = new Date();
          const sendDateTime = sendDate.value ? new Date(sendDate.value) : now;

          if (isNaN(sendDateTime.getTime())) {
            console.error('Invalid sendDate value:', sendDate.value);
            return;
          }

          const messageData = {
            creationDate: now,
            sendDate: sendDateTime,
            user: user.value.uid,
            message: message.value,
            receiverId: props.receiverId,
            chatType: 'individual',
            isSent: sendDateTime <= now,
          };

          console.log('Sending message with:', messageData);

          await addDoc(collection(db, 'messages'), messageData);

          console.log('Message sent successfully');
          message.value = '';
          sendDate.value = '';

          
          window.dispatchEvent(new CustomEvent('message-sent', { detail: props.receiverId }));
        } catch (error) {
          console.error('Error sending message:', error);
        }
      } else {
        console.error('User is not authenticated or receiverId is missing');
      }
    };

    return { message, sendDate, sendMessage };
  },
};
</script>

<style scoped>
.chat-form {
  padding: 20px;
}
</style>