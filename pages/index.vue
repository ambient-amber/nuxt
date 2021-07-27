<template>
  <div>
    <!--<Tutorial/>-->
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
      messages_history: [
        {
          text: 'Привет',
          is_mine: true
        },
        {
          text: 'Очень оригинально! Не пиши мне!',
          is_mine: false
        },
        {
          text: 'Да ладно тебе, крошка!',
          is_mine: true
        },
        {
          text: 'Игнор!',
          is_mine: false
        }
      ],
      message: ''
    }
  },
  methods: {
    async sendMessage() {
      let socket = new WebSocket("ws://192.168.0.14:3000/chat/");

      socket.onopen = function() {
        console.log("Соединение установлено.");

        if (this.message) {
          socket.send(this.message);

          this.messages_history.push({
            text: this.message,
            is_mine: true
          });
          this.message = '';
        }
      };
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
