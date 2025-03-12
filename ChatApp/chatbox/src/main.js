import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from './firebase/config';
import './assets/main.css';

let app = null;

auth.onAuthStateChanged(user => {
  if (!app) {
    console.log('Mounting Vue app');
    app = createApp(App).use(router).mount('#app');
  }

  if (!user) {
    console.log('No user logged in, redirecting to login page');
    router.replace('/login');
  } else {
    console.log('User logged in:', user);
  }
});
