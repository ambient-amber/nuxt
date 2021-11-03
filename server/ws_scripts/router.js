const chat = require('./chat');
const users = require('./users');

exports.route = async (ws, data, ws_connection_id) => {
    data = JSON.parse(data);

    if (data.request_type) {
        if (data.request_type === 'login') {
            // Авторизация пользователя
            await users.login(ws, data, ws_connection_id);
        } else if (data.request_type === 'send_message') {
            // Отправка сообщения от пользователя
            await chat.sendMessage(ws, data, ws_connection_id);
        }
    }
};
