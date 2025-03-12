<template>
  <div class="home container">
   
    <div v-if="isMember">
      <Login @login="startChat" />
      
    </div>
    <div v-else>
      <Register @register="startChat" />
      
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


import Register from '../components/Register.vue';
import Login from '../components/Login.vue';

export default {
  components: {
    Register,
    Login
  },
  setup() {
    const isMember = ref(true);
    const router = useRouter();

    const startChat = () => {
   
      router.push({ name: 'HomePage' }).catch(err => {
        console.error('Failed to navigate:', err);
      });
    };

    return { isMember, startChat };
  }
};
</script>

