<template>
  <div class="home-page">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />

    <h1>Welcome to the Home Page</h1>
    <div class="section-container">
     
      <div class="section">
        <h2>For chatting:</h2>
        <button @click="navigateTo('AddFriendView')">Add Friend</button>
        <button @click="navigateTo('ChatRoom')">Chat Room</button>
      </div>

    
      <div class="section">
        <h2>For lettering:</h2>
        <button @click="navigateTo('LetterRoom')">Letter Room</button>
        <button @click="navigateTo('ShowLetters')">Letter Page</button>
      </div>
    </div>

    <div class="exit-button">
      <button @click="exit">Exit</button>
    </div>
  </div>
</template>


<script>
import { useRouter } from 'vue-router';
import { auth } from '../firebase/config'; 

export default {
  setup() {
    const router = useRouter();

    const navigateTo = (routeName) => {
      router.push({ name: routeName });
    };
    const exit = async () => {
      try {
        await auth.signOut();
        router.push({ name: 'login' });
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };

    return { navigateTo, exit };
  }
};
</script>

<style scoped>
.home-page {
  text-align: center;
  padding: 20px;
  background-color: #242441;
  color: #db7610;
  min-height: 95vh;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
}

h1 {
  margin-bottom: 30px;
  color: #db7610;
}


.section-container {
  display: flex;
  justify-content: center; 
  gap: 50px;
  margin-bottom: 30px; 
}


.section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #db7610;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 200px; 
}


.exit-button {
  margin-top: 40px; 
  display: flex;
  justify-content: center; 
}

.exit-button button {
  width: 200px;
}


button:hover {
  background-color: #f08c42;
  transform: translateY(-2px);
}

h2 {
  color: #db7610;
}
.logo {
  max-width: 200px;
  width: 90%;
  height: 200px;
  margin-bottom: 0; 
}

</style>
