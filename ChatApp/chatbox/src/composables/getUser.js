import { ref, onMounted } from 'vue';
import { auth } from '../firebase/config';  
import { onAuthStateChanged } from 'firebase/auth';

const user = ref(null); 

const getUser = () => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      console.log('User is authenticated:', currentUser);
      user.value = currentUser;
    } else {
      console.log('User is not authenticated');
      user.value = null;
    }
  });

  onMounted(() => {
    if (auth.currentUser) {
      user.value = auth.currentUser;
      console.log('User authenticated on mount:', auth.currentUser);
    }
  });

  return { user };
};

export default getUser;
