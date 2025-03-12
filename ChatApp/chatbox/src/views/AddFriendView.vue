<template>
  <div class="add-friend-view">
    <div class="main-content">
      <h2>Add a Friend</h2>

      <form @submit.prevent="addFriend" class="form-container">
        <div class="input-group">
          <label for="username">Friend's Username:</label>
          <input type="text" v-model="friendUsername" id="username" required />
        </div>
        <div class="button-container">
          <button type="submit">Add Friend</button>
        </div>
      </form>

      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>
      <br />

      <div v-if="successMessage" class="success">
        {{ successMessage }}
      </div>
      <br />

      <h3>Friend Requests</h3>
      <br />
      <div v-if="friendRequests.length === 0" class="no-requests">
        No friend requests.
      </div>
      <ul v-if="friendRequests.length > 0">
        <li v-for="request in friendRequests" :key="request.id">
          {{ request.user1Username }} sent you a friend request
          <button @click="acceptRequest(request.id)">Accept</button>
          <button @click="declineRequest(request.id)">Decline</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { getUserByUsername } from '../composables/getUserByUsername';
import { useFriendRequests } from '../composables/useFriendRequests';
import { useRouter } from 'vue-router';
export default {
  setup() {
    const friendUsername = ref('');
    const errorMessage = ref('');
    const successMessage = ref('');
    const user = ref(null);
    const router = useRouter(); 
    const { friendRequests, loadRequests, acceptRequest, declineRequest } = useFriendRequests();

    onMounted(() => {
      auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          user.value = currentUser;
          await loadRequests(currentUser.uid); 
        } else {
          router.push({ name: 'Login' });
        }
      });
    });
    
    const addFriend = async () => {
      errorMessage.value = '';
      successMessage.value = '';
      try {
        if (friendUsername.value.trim() === '') {
          throw new Error('Username is required');
        }

        if (!user.value) {
          throw new Error('You need to be logged in to add a friend');
        }

        const userData = await getUserByUsername(friendUsername.value.trim());
        if (!userData) {
          throw new Error('User not found');
        }

        const receiverId = userData.uid;

        if (user.value.uid === receiverId) {
          throw new Error('You cannot add yourself as a friend');
        }

        await addDoc(collection(db, 'friends'), {
          user1: user.value.uid,
          user2: receiverId,
          status: 'pending',
          createdAt: new Date(),
        });

        successMessage.value = 'Friend request sent successfully!';
        friendUsername.value = '';

        setTimeout(() => {
          successMessage.value = '';
        }, 3000);

        await loadRequests();
      } catch (error) {
        errorMessage.value = `Error: ${error.message}`;
      }
    };

    return {
      friendUsername,
      addFriend,
      errorMessage,
      successMessage,
      friendRequests,
      acceptRequest,
      declineRequest,
    };
  },
};
</script>

<style scoped>
.add-friend-view {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  background-color: #242441;
  color: #db7610;
}

.main-content {
  width: 100%;
  max-width: 500px;
  background-color: #2e3b55;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.input-group {
  width: 100%;
}

input {
  width: 92%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #db7610;
  font-size: 16px;
}

button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background-color: #db7610;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
  background-color: #f08c42;
  transform: translateY(-2px);
}

h3 {
  margin-top: 20px;
  margin-bottom: 20px;
}

.no-requests {
  margin-top: 20px;
  color: white;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
