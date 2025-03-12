
import { ref } from 'vue';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const getLetters = () => {
  const letters = ref([]);
  const error = ref(null);

  const loadLetters = async () => {
    try {
      
      const lettersQuery = query(
        collection(db, 'letters'),
        orderBy('creationDate', 'desc')
      );

      // firestoredan verileri al
      const querySnapshot = await getDocs(lettersQuery);
      let lettersArray = [];

     
      querySnapshot.forEach((doc) => {
        lettersArray.push({ id: doc.id, ...doc.data() });
      });
      console.log(lettersArray); 
      letters.value = lettersArray;
    } catch (err) {
      error.value = err.message;
      console.error("Error fetching letters:", err);
    }
  };

  
  loadLetters();

  return { letters, error };
};

export default getLetters;
