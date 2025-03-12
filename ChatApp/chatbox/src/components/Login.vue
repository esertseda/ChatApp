<template>
  <div class="center-content">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
    <div class="container-box">
      <h1>Login</h1>
      <form @submit.prevent="logIn">
        <input type="text" placeholder="Email" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
        <button>Login</button>
      </form>
      <div class="error">
        {{ hata }}
      </div>
      <div class="register">
        <p>Not a member yet? <span @click="navigateToRegister">Register</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import useLogin from '../composables/useLogin';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const { hata, login } = useLogin();
    const router = useRouter();

    const logIn = async () => {
      await login(email.value, password.value);
      if (!hata.value) {
        router.push({ name: 'HomePage' });
      }
    };

    const navigateToRegister = () => {
      router.push({ name: 'Register' });
    };

    return { email, password, logIn, hata, navigateToRegister };
  }
};
</script>
<style scoped>
.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #242441;
  padding: 10px;
}
.container-box {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  color:#242441;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin: 20px 0; 
}

.logo {
  max-width: 300px;
  width: 90%;
  height: auto; 
  margin-bottom: 20px; 
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px;
  background-color: #db7610;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #f08c42;
}

.error {
  color: red;
  margin-top: 10px;
}

.register {
  margin-top: 15px;
}

.register span {
  color: #db7610;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
}

.register span:hover {
  color: #f08c42;
}

p {
  color:#242441;
}


@media (max-width: 600px) {
  .container-box {
    padding: 15px;
    max-width: 350px;
  }

  .logo {
    max-width: 200px;
  }

  form {
    gap: 10px;
  }

  button {
    padding: 8px;
  }
}
</style>
