<template>
  <div class="chat-room">
    
    <div class="content">
      <div v-if="selectReceiverId">
        <ChatWindow :receiverId="selectReceiverId" />
        <ChatForm :receiverId="selectReceiverId" />
      </div>
      <div v-else>
        <div class="friend-list">
          <h2>Select a friend to start chatting:</h2>
          <ul>
            <li v-for="friend in friends" :key="friend.id">
              <button @click="selectFriend(friend.id)">
                {{ friend.username }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import ChatForm from '../components/ChatForm.vue';
import ChatWindow from '../components/ChatWindow.vue';
import { getUsernameById } from '../utils/utils'; 

export default {
  name: 'ChatRoom',
  components: {
    ChatForm,
    ChatWindow
  },
  setup() {
    const friends = ref([]);
    const selectReceiverId = ref(null);
    const user = ref(null);

    // Kullanıcı oturum açma durumunu takip et
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        user.value = currentUser;
        loadFriends();
      } else {
        friends.value = [];
      }
    });

    // Arkadaşları yükle
    const loadFriends = async () => {
  if (user.value) {
    try {
      const q1 = query(collection(db, 'friends'), where('user1', '==', user.value.uid), where('status', '==', 'accepted'));
      const q2 = query(collection(db, 'friends'), where('user2', '==', user.value.uid), where('status', '==', 'accepted'));

      const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ]);

      const friends1 = querySnapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const friends2 = querySnapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const allFriends = [...friends1, ...friends2];

      const friendList = [];
      for (const friend of allFriends) {
        const receiverId = friend.user1 === user.value.uid ? friend.user2 : friend.user1;
        const username = await getUsernameById(receiverId);
        friendList.push({ id: receiverId, username });
      }

      friends.value = friendList;
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  }
};


    // Arkadaş seçimini yönet
    const selectFriend = (friendId) => {
      selectReceiverId.value = friendId;
    };

    
    watch(() => selectReceiverId.value, (newValue) => {
      if (newValue) {
        loadFriends();
      }
    });

    return { friends, selectReceiverId, selectFriend };
  }
};
</script>

<style scoped>
.chat-room {
  display: flex;
 flex-direction: column;
  height: 50vh;
  text-align: center;
  
}



.friend-list {
  width: 600px;
  text-align: center;
  padding: 20px;
}

.friend-list ul {
  list-style-type: none;
  padding: 0;
  text-align: center;
}

.friend-list li {
  margin-bottom: 10px;
  text-align: center;
}

.friend-list button {
  background-color: #db7610;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  text-align: center;
}

.friend-list button:hover {
  background-color: #0056b3;
}
</style>
