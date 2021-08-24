<template>
  <div>
    <div class="dialog">
      <div class="message" :class="{'mine': message.is_mine}" v-for="(message, index) in messages_history" :key="index">
        <div class="message_inner">{{ message.text }}</div>
      </div>
    </div>

    <textarea v-model="message" cols="30" rows="10"></textarea>
    <a @click="sendMessage" href="#">Отправить</a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ws_connection: null,
      messages_history: [
        {
          text: '1',
          is_mine: true
        },
        {
          text: '2',
          is_mine: false
        },
        {
          text: '3',
          is_mine: true
        },
        {
          text: '4',
          is_mine: false
        }
      ],
      message: ''
    }
  },
  async mounted() {
    await this.connectToServer();
    await this.getUser();
  },
  methods: {
    async sendMessage() {
      this.ws_connection.send(this.message);

      this.ws_connection.onmessage = (event) => {
        console.log('event', event.data);

        this.messages_history.push({
          text: this.message,
          is_mine: true
        });
      };
    },
    async connectToServer() {
      const ws = new WebSocket('ws://localhost:3030/');

      return new Promise((resolve, reject) => {
        const timer = setInterval(() => {
          if (ws.readyState === 1) {
            clearInterval(timer);
            this.ws_connection = ws;
            resolve();
          }
        }, 10);
      });
    },
    async getUser() {
      let user = await this.$axios.get('/api/users/get_user/1');

      console.log('user', user);
    }
  }
}
</script>

<style>
  .dialog {
    width: 500px;
  }

  .message {
    display: flex;
    justify-content: flex-end;
    margin: 0 0 15px;
  }
  .message.mine {
    justify-content: flex-start;
  }

  .message_inner {
    background: pink;
    color: #000;
    padding: 20px;
    border-radius: 5px;
  }
  .mine .message_inner {
    background: green;
    color: #fff;
  }
</style>
