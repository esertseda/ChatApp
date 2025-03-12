<template>
  <div class="register-container">
    <img src="@/assets/logo.png" alt="Logo" class="logo" />
    
    <div class="form-container">
      <form @submit.prevent="register">
        <h1>Register</h1>
        <input type="text" placeholder="Please enter your user name:" v-model="userName" />
        <input type="text" placeholder="Please enter your email:" v-model="email" />
        <input type="password" placeholder="Please enter your password:" v-model="password" />
        <button>Register</button>

        <div v-if="errorMessage" class="error">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="success">
          {{ successMessage }}
        </div>
      </form>

      <div class="login-link">
        <p>Already have an account? <router-link to="/login">Log in here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import useRegister from '../composables/useRegister';

export default {
  setup() {
    const userName = ref('');
    const email = ref('');
    const password = ref('');

    const { errorMessage, successMessage, signUp } = useRegister();
    const router = useRouter();

    const register = async () => {
      try {
        await signUp(email.value, password.value, userName.value);
        router.push({ name: 'HomePage' });
      } catch (error) {
        errorMessage.value = error.message;
      }
    };

    return { userName, email, password, register, errorMessage, successMessage };
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #242441;
}

.logo {
  width: 90%;
  max-width: 275px;
  margin-bottom: 0px;
  height: 230px; 
}

.form-container {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.success {
  color: green;
  margin-top: 10px;
}

.login-link {
  margin-top: 20px;
}

.login-link p {
  color: #242441;
}

.login-link a {
  color: #db7610;
  font-weight: bold;
  text-decoration: none;
}

.login-link a:hover {
  color: #f08c42;
}
</style>
