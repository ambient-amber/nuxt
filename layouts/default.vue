<template>
  <div class="default_layout">
    <div v-if="is_auth">
      <p>Вы авторизованы как <b>{{ user.name }}</b></p>
      <p>
        <a href="#" @click="logOut">Выход</a>
      </p>

      <TheHeader />
      <Nuxt />
      <TheFooter />
    </div>
    <div v-else>
      <p>Существующие пользователи:</p>
      <ul>
        <li>honey moon</li>
        <li>ambient amber</li>
        <li>sister mercy</li>
      </ul>

      <form ref="auth_form">
        <input type="text" v-model="login">
        <input type="password" v-model="password">

        <div v-if="auth_error">
          {{ auth_error }}
        </div>

        <a href="#" @click="logIn">Авторизоваться</a>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        is_auth: false,
        login: '',
        password: '',
        user: {},
        auth_error: ''
      }
    },
    /*computed: {
      is_auth() {
        if (process.browser){
          return (localStorage.getItem('user_token'));
        }
      },
    },*/
    /*async mounted() {
      await this.connectToServer();
    },*/
    methods: {
      async logIn() {
        this.auth_error = '';

        let auth = await this.$axios.post('/api/users/login', {
          login: this.login,
          password: this.password
        });

        if (auth.data.is_success) {
          this.is_auth = true;
          this.user = auth.data.data;

          this.$store.commit('users/setUser', this.user);
        } else {
          this.auth_error = auth.data.message;
        }
      },
      async logOut() {
        this.user = {};
        this.is_auth = false;
      },
      /*async connectToServer() {
        const ws = new WebSocket('ws://localhost:3030/');

        return new Promise((resolve, reject) => {
          const timer = setInterval(() => {
            if (ws.readyState === 1) {
              clearInterval(timer);
              this.$store.commit('ws/setConnection', ws);
              resolve();
            }
          }, 10);
        });
      },*/
      /*async getUser() {
        let user = await this.$axios.get('/api/users/get_user/1');

        console.log('user', user);
      },*/
    }
  }
</script>
