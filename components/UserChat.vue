<template>
    <div class="user_chat_wrap">
        <div class="user_chat">
            <div class="user_chat_titles">
                <div v-for="companion in companions"
                     :key="companion.id"
                     @click="toggleCompanion(companion)"
                     :class="['user_chat_title', {selected: (selected_companion_id === companion.id)}]"
                >
                    {{ companion.name }}
                </div>
            </div>
            <div class="user_chat_dialogs">
                <div v-for="companion of companions"
                     :key="companion.id"
                     :class="['user_chat_dialog', {selected: (selected_companion_id === companion.id)}]"
                >
                    <div v-for="(message, index) in companion.messages"
                         :key="index"
                         :class="['user_chat_dialog_message', {'mine': message.is_mine}]"
                    >
                        <div class="user_chat_dialog_message_inner">{{ message.message }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="user_chat_new_message">
            <textarea class="user_chat_new_message_textarea" v-model="new_message" rows="10"></textarea>
            <div class="user_chat_new_message_send_button" @click="sendMessage"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'UserChat',
        data() {
            return {
                selected_companion_id: null,
                new_message: '',
                companions: {},
            }
        },
        computed: {
            user() {
                return this.$store.state.users.user;
            },
            /*ws_connection() {
                return this.$store.state.ws.ws;
            }*/
        },
        async mounted() {
            await this.getUserCompanions();

            this.receiveNewMessage();
        },
        methods: {
            sendMessage() {
                this.$websocket.send(
                    {
                        request_type: 'send_message',
                        text: this.new_message,
                        user_id_to: this.selected_companion_id,
                        user_id_from: this.user.id
                    },
                    (data) => {
                        console.log('send_message callback data', data);

                        this.companions[this.selected_companion_id].messages.push({
                            message: this.new_message,
                            is_mine: true
                        });

                        this.new_message = '';
                    }
                );
            },
            /**
             * Сохраняем текущее сообщение за выбранным до изменения собеседником.
             * Меняем активного собеседника.
             * Делаем активным сообщением сообщение нового активного собеседника.
             * */
            async toggleCompanion(companion) {
                this.selected_companion_id = companion.id;
                this.companions[companion.id].new_message = this.new_message;
                this.new_message = companion.new_message;

                if (!companion.messages.length) {
                    await this.getUserCompanionMessages(companion);
                }

                console.log('companion', companion);
            },
            async getUserCompanions() {
                let response = await this.$axios.post('/api/users/get_companions', {
                    user_id: this.user.id
                });

                if (response.data.is_success) {
                    this.$set(this, 'companions', response.data.data.companions);
                } else {
                    alert(response.data.message);
                }
            },
            /**
             * Получение части переписки с выбранным пользователем.
             * Вызывается при выборе собеседника, если сообщения еще не загружены, и при скролле переписки.
             * */
            async getUserCompanionMessages(companion) {
                let response = await this.$axios.post('/api/users/get_companion_messages', {
                    user_id: this.user.id,
                    companion_id: companion.id,
                    offset: companion.messages.length
                });

                if (response.data.is_success) {
                    this.companions[this.selected_companion_id].messages = response.data.data.messages.concat(
                        this.companions[this.selected_companion_id].messages
                    );
                } else {
                    alert(response.data.message);
                }
            },
            /**
             * Подписка на получение от сокета в фоне новых сообщений от пользователей.
             * */
            receiveNewMessage() {
                this.$websocket.subscribe(
                    {
                        request_type: 'receive_new_message',
                        user_id: this.user.id
                    },
                    (data) => {
                        console.log('receiveNewMessage callback data', data);

                        this.companions[data.companion_id].messages.push({
                            message: data.text,
                            is_mine: false
                        });
                    }
                )
            }
        }
    }
</script>

<style>
    .user_chat_wrap {
        width: 500px;
        margin: 0 0 40px;
    }
    .user_chat {
        display: flex;
        box-sizing: border-box;
    }

    .user_chat_titles {
        display: flex;
        flex-direction: column;
    }

    .user_chat_title {
        color: grey;
        border: 1px solid grey;
        margin: 0 0 20px;
        padding: 10px;
        cursor: pointer;
    }

    .user_chat_title.selected {
        color: black;
        border: 1px solid black;
    }

    .user_chat_dialogs {
        display: flex;
        flex: 1;
        flex-direction: column;
        height: 150px;
        overflow-y: scroll;
        padding: 0 10px;
    }

    .user_chat_dialog {
        display: none;
    }
    .user_chat_dialog.selected {
        display: block;
    }

    .user_chat_dialog_message {
        display: flex;
        justify-content: flex-end;
        margin: 0 0 5px;
    }
    .user_chat_dialog_message.mine {
        justify-content: flex-start;
    }

    .user_chat_dialog_message_inner {
        background: pink;
        color: #000;
        padding: 5px;
        border-radius: 5px;
    }
    .mine .user_chat_dialog_message_inner {
        background: green;
        color: #fff;
    }

    .user_chat_new_message {
        display: flex;
        flex-flow: row nowrap;
    }

    .user_chat_new_message_textarea {
        flex-grow: 1;
    }

    .user_chat_new_message_send_button {
        width: 25px;
        position: relative;
        background: #7777d4;
        cursor: pointer;
    }
    .user_chat_new_message_send_button:before {
        content: '>';
        position: absolute;
        height: 24px;
        width: 24px;
        top: 50%;
        margin: -12px 0 0;
        text-align: center;
        color: #fff;
    }
</style>
