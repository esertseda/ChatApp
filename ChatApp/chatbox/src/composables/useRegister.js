import { ref } from 'vue';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const hata = ref(null);
const success = ref(null);

const signUp = async (email, password, userName) => {
  hata.value = null;
  success.value = null;

  try {
    
    if (userName.trim() === '') {
      throw new Error('You have to enter a username!');
    }

    
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (!res) {
      throw new Error('Registration process could not be completed!');
    }

  
    await updateProfile(res.user, { displayName: userName });

    
    await addDoc(collection(db, 'users'), {
      uid: res.user.uid,
      email: res.user.email,
      username: userName,
      createdAt: Timestamp.now()  
    });

   
    success.value = 'User registered and added to Firestore!';
    console.log('User registered successfully:', res.user);
    
    return res;
  } catch (error) {
    
    hata.value = error.message;
    console.error('Error during registration:', error.message);
  }
};

const useRegister = () => {
  return { hata, success, signUp };
};

export default useRegister;
