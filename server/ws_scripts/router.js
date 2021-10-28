const chat = require('./chat');

exports.route = async (ws, clients, data) => {
    data = JSON.parse(data);

    if (data.request_type) {
        if (data.request_type === 'send_message') {
            let result = await chat.sendMessage(data);

            console.log(result);

            if (result) {
                for (let key in clients) {
                    // ToDo определиться как отправлять данные только нужным пользователям, а не всем подряд

                    // Ответ запроса на отправку сообщения от пользователя
                    clients[key].send(JSON.stringify(data));

                    // Уведомление пользователя о новом сообщении, если он онлайн
                    clients[key].send(JSON.stringify({
                        from_user: {},
                        text: {},
                    }));


                }
            }
        }
    }
};
