<template>
  <div class="letter-room">
    
    <h3>📬 Letter Room</h3>
    <form @submit.prevent="handleSubmit">
      <input v-model="letter" placeholder="Type your letter here." required />
      <input type="datetime-local" v-model="sendDate" required />
      <button type="submit">Send</button>
      <p>To see your letters: </p>
      <button @click="navigateTo('ShowLetters')">Letter Page</button>
    </form>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { ref } from 'vue';
import sendLetter from '../composables/sendLetter';
import { useRouter } from 'vue-router';
import { auth } from '../firebase/config';


export default {
  
  setup() {
    const letter = ref('');
    const sendDate = ref('');
    const successMessage = ref('');
    const errorMessage = ref('');
    const router = useRouter();

    const navigateTo = (routeName) => {
      router.push({ name: routeName });
    };

    const handleSubmit = async () => {
      try {
        const formattedSendDate = new Date(sendDate.value);
        if (isNaN(formattedSendDate.getTime())) {
          throw new Error('Please select a valid date and time for sending the letter.');
        }

        const senderId = auth.currentUser.uid;
        const letterContent = letter.value;

        await sendLetter(senderId, letterContent, formattedSendDate);
        successMessage.value = 'Letter scheduled successfully.';
        errorMessage.value = '';
      } catch (error) {
        successMessage.value = '';
        errorMessage.value = 'Error scheduling letter: ' + error.message;
      }
    };

    return {
      letter,
      sendDate,
      successMessage,
      errorMessage,
      handleSubmit,
      navigateTo
    };
  }
};
</script>
<style scoped>
h3{
  font-size: 40px;
}
</style>