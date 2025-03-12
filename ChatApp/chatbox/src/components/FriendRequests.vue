
<template>
  <div class="center-content">
    <div class="container-box">
      <h1>Friend Requests</h1>
      <ul v-if="requests.length > 0">
        <li v-for="request in requests" :key="request.id">
          {{ request.user1Username }} wants to be your friend.
          <button @click="acceptRequest(request.id)">Accept</button>
          <button @click="declineRequest(request.id)">Decline</button>
        </li>
      </ul>
      <div v-else>No friend requests.</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import useFriendRequests from '../composables/useFriendRequests';

export default {
  setup() {
    const { requests, acceptRequest, declineRequest } = useFriendRequests();
    return { requests, acceptRequest, declineRequest };
  }
};
</script>