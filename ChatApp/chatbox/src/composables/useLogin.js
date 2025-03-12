import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const useLogin = () => {
  const hata = ref(null);

  const login = async (email, password) => {
    hata.value = null;

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (!res) {
        throw new Error('Login process could not be completed!');
      }
      console.log('User logged in successfully:', res.user);
      return res;
    } catch (error) {
      hata.value = error.message;
      console.error('Error during login:', error.message);
    }
  };

  return { hata, login };
};

export default useLogin;
