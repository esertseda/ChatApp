<template>
  <nav class="navbar">

    <div class="left-section">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <div v-if="user" class="user-info">
        <p class="hi-name">Hi {{ user.displayName }}!</p>
        <p class="email">You logged in with {{ user.email }}</p>
      </div>
    </div>

    <div class="right-section">
      

      <button v-if="!isActiveRoute('HomePage')" @click="goToHomePage">Home Page</button>
      <button v-if="!isActiveRoute('AddFriendView')" @click="goToAddFriend">Add Friend</button>
      <button v-if="!isActiveRoute('ChatRoom')" @click="goToChatRoom">Chat Room</button>
      <button v-if="!isActiveRoute('ScheduledMessagesView')" @click="goToScheduledMessages">Scheduled Messages</button>
      <button v-if="!isActiveRoute('LetterRoom')" @click="goToLetterRoom">Letter Room</button>
      <button v-if="!isActiveRoute('ShowLetters')" @click="goToShowLetters">Show Letters</button>

      <button @click="exit">Exit</button>
    </div>
  </nav>
</template>

<script>
import { auth } from '../firebase/config';
import { useRouter, useRoute } from 'vue-router';
import getUser from '../composables/getUser';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { user } = getUser();

    const isActiveRoute = (routeName) => {
      return route.name === routeName;
    };

    const goToHomePage = () => {
      router.push({ name: 'HomePage' });
    };

    const goToAddFriend = () => {
      router.push({ name: 'AddFriendView' });
    };

    const goToChatRoom = () => {
      router.push({ name: 'ChatRoom' });
    };

    const goToLetterRoom = () => {
      router.push({ name: 'LetterRoom' });
    };

    const goToShowLetters = () => {
      router.push({ name: 'ShowLetters' });
    };

    const goToScheduledMessages = () => {
      router.push({ name: 'ScheduledMessagesView' });
    };

    const exit = async () => {
      try {
        await auth.signOut();
        router.push({ name: 'Login' });
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    return {
      exit,
      user,
      goToAddFriend,
      goToHomePage,
      goToChatRoom,
      goToLetterRoom,
      goToShowLetters,
      goToScheduledMessages,
      isActiveRoute,
    };
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #242441;
  color: white;
  height: 80px;
}

.left-section {
  display: flex;
  align-items: center;
}

.logo {
  height: 100%; 
  max-height: 100px; 
  object-fit: contain; 
  margin-right: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.right-section {
  display: flex;
  gap: 10px;
}

.navbar ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 15px;
}

.navbar button {
  padding: 5px 10px;
  background-color: #db7610;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  width: auto;
}

.navbar button:hover {
  background-color: #f08c42;
}

.hi-name,
.email {
  color: white;
}
</style>
