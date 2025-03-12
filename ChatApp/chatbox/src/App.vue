<template>
  <div id="app">
    <!-- Navbar sadece belirli sayfalarda gösterilecek -->
    <Navbar v-if="shouldShowNavbar" />
    <router-view />
  </div>
</template>

<script>
import fixSenderIds from './scripts/fixSenderIds';
import Navbar from './components/Navbar.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
export default {
  name: 'App',
  components: {
    Navbar,
  },
  setup() {
    const route = useRoute();
    const shouldShowNavbar = computed(() => {
      // Bu sayfalar dışında her sayfada navbarı göster
      return !['/login', '/register', '/','/home'].includes(route.path);
    });
    return { shouldShowNavbar };
  },
  mounted() {
    fixSenderIds();
  },
};
</script>
