import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChatRoom from '../views/ChatRoom.vue';
import ScheduledMessagesView from '../views/ScheduledMessagesView.vue';
import AddFriendView from '../views/AddFriendView.vue';
import HomePage from '../views/HomePage.vue';
import { auth } from '../firebase/config';
import Login from '../components/Login.vue';
import LetterRoom from '../views/LetterRoom.vue';
import ShowLetters from '../views/ShowLetters.vue';
import Register from '../components/Register.vue'

const authControl = async (to, from, next) => {
  auth.onAuthStateChanged(user => {
    if (user) {
      if (to.name === 'Login') {
        next({ name: 'HomePage' }); // Zaten giriş yapmışsa ana sayfaya yönlendir
      } else {
        next(); 
      }
    } else {
      if (to.name !== 'Login') {
        next({ name: 'Login' }); // Oturum açmamışsa login sayfasına yönlendir
      } else {
        next(); // Login sayfasındaysa yönlendirme yapma
      }
    }
  });
};


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: authControl, 
  },
  {
    path: '/chat',
    name: 'ChatRoom',
    component: ChatRoom,
    beforeEnter: authControl, 
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/scheduled',
    name: 'ScheduledMessagesView',
    component: ScheduledMessagesView,
    beforeEnter: authControl, 
  },
  {
    path: '/add-friend',
    name: 'AddFriendView',
    component: AddFriendView,
    beforeEnter: authControl, 
  },
  {
    path: '/letter-room',
    name: 'LetterRoom',
    component: LetterRoom,
    beforeEnter: authControl, 
  },
  {
    path: '/show-letters',
    name: 'ShowLetters',
    component: ShowLetters,
    beforeEnter: authControl, 
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
    beforeEnter: authControl, 
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/letters',
    name: 'ShowLetters',
    component: ShowLetters 
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
