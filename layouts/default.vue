<template>
  <div class="default_layout">
    <div v-if="user.id">
      <p>Вы авторизованы как <b>{{ user.name }}</b></p>
      <p>
        <a href="#" @click="logOut">Выход</a>
      </p>

      <TheHeader />
      <Nuxt />
      <UserChat />
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
        login: '',
        password: '',
        auth_error: '',
        user: {}
      }
    },
    /*computed: {
      user() {
          return this.$store.state.users.user;
      },
    },*/
    methods: {
      async logIn() {
        this.auth_error = '';

        this.$websocket.send(
          {
            request_type: 'login',
            login: this.login,
            password: this.password
          },
          (response) => {
            if (response.is_success) {
              this.user = response.data.user;

              this.$store.commit('users/setUser', this.user);
            } else {
              this.auth_error = response.data.message;
            }
          }
        );

        /*let auth = await this.$axios.post('/api/users/login', {
          login: this.login,
          password: this.password
        });

        if (auth.data.is_success) {
          this.is_auth = true;
          this.user = auth.data.data;

          this.$store.commit('users/setUser', this.user);
        } else {
          this.auth_error = auth.data.message;
        }*/
      },
      async logOut() {
        this.user = {};
        this.is_auth = false;
      }
    }
  }
</script>
