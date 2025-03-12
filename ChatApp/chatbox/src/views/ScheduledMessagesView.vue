<template>
  <div class="scheduled-messages">
   
    <h3 class="title">Scheduled Messages</h3>
    <div v-if="error">{{ error }}</div>
    <div v-if="messages.length" class="message-list">
      <div v-for="message in messages" :key="message.id" class="message-item">
        <p><strong>to Who:</strong> {{ message.receiverName }}</p>
        <p><strong>Message:</strong> {{ message.message }}</p>
        <p><strong>Send Date:</strong> {{ formatDate(message.sendDate) }}</p>
      </div>
    </div>
    <div v-else>No scheduled messages</div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import getScheduledMessages from '../composables/getScheduledMessages';
import { format } from 'date-fns';


export default {
 
  setup() {
    const { messages, error, unsubscribe } = getScheduledMessages();

    onMounted(() => {
      return () => unsubscribe();
    });

    const formatDate = (date) => format(date, 'yyyy-MM-dd HH:mm:ss');

    return { messages, error, formatDate };
  }
};
</script>

<style scoped>
.scheduled-messages {
  padding: 20px;
  color: white;
}

.title {
  margin-bottom: 50px;
}

.message-list {
  padding: 20px;
}

.message-item {
  margin-bottom: 20px;
}

.message-item p {
  margin: 0;
}
</style>
