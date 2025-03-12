<template>
  <div class="letters">
   
    <h1>Your Letters</h1>
   
    <ul v-if="lettersState && lettersState.length > 0">
      <li v-for="letter in lettersState" :key="letter.id">
        <div>
          <p v-if="letter.isVisible">
            <strong>Creation Date:</strong> 
            {{ letter.creationDate ? letter.creationDate.toDate().toLocaleString() : 'No creation date available' }}
            <br />
            <strong>Send Date:</strong> 
            {{ letter.sendDate ? letter.sendDate.toDate().toLocaleString() : 'No send date available' }}
            <br />
            <strong>Content:</strong> 
            {{ letter.letterContent ? letter.letterContent : 'No content available' }}
            <br />
            <strong>Sender:</strong> 
            {{ letter.senderName ? letter.senderName : 'Unknown sender' }}
          </p>
          <p v-else>
            🔒 Letter is not visible yet.<br />
            <strong>Sender:</strong> 
            {{ letter.senderName ? letter.senderName : 'Unknown sender' }} <br />
            <strong>Send Date:</strong> 
            {{ letter.sendDate ? letter.sendDate.toDate().toLocaleString() : 'No send date available' }}
            <br />
          </p>
        </div>
      </li>
    </ul>
    <p v-else>No letters available.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getUsernameById } from '../utils/utils';


export default {
 
  setup() {
    const lettersState = ref([]);

    onMounted(async () => {
      try {
        const lettersQuery = query(
          collection(db, 'letters'),
          orderBy('creationDate', 'desc')
        );

        const querySnapshot = await getDocs(lettersQuery);
        const letters = [];
        const currentDate = new Date();

        for (const doc of querySnapshot.docs) {
          const letterData = doc.data();
          const sendDate = letterData.sendDate.toDate();
          letterData.isVisible = sendDate <= currentDate;
          const senderName = await getUsernameById(letterData.senderId);
          letterData.senderName = senderName || 'Unknown User';
          letters.push({ id: doc.id, ...letterData });
        }

        lettersState.value = letters;
      } catch (error) {
        console.error('Error fetching letters:', error);
      }
    });

    return {
      lettersState,
      
    };
  },
};
</script>

<style scoped>
.letters {
  padding: 20px;
  background-color: #f5f5f5;
  color:black;
}
.button-container {
  display: flex;
  gap: 10px;
}
button {
  padding: 10px 20px;
}
</style>
