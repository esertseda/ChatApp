
<template>
  <div>
    <button @click="updateMessages">Update Messages</button>
    <button @click="addMessage(
      new Date(), 
      new Date(), 
      'userId1', 
      'Hello!', 
      'individual', 
      'userId2')">Add Message</button>
  </div>
</template>

<script>
import { useMessages } from '../composables/useMessages';

export default {
  setup() {
    const { updateMessages, addMessage } = useMessages();

    return { updateMessages, addMessage };
  }
};
</script>
