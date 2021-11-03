exports.sendMessage = async (ws, data) => {
    let result = {};

    try {
        if (!data.user_id_from) {
            throw new Error('Не указан отправитель сообщения');
        } else if (!data.user_id_to) {
            throw new Error('Не указан получатель сообщения');
        } else if (!data.text) {
            throw new Error('Сообщение не может быть пустым.');
        }

        await global.db.query(`
            INSERT INTO user_messages(
                user_id_from,
                user_id_to,
                message
            ) VALUES($1, $2, $3)
        `, [
            data.user_id_from,
            data.user_id_to,
            data.text
        ]);

        // Отправка сообщения пользователю
        // ToDo реализовать случай, когда пользователь еще не переписывался с отправителем сообщения.
        for (let connection_id in global.ws_clients) {
            let ws_client = global.ws_clients[connection_id];

            if (ws_client.user && ws_client.user.id === data.user_id_to) {
                ws_client.ws.send(JSON.stringify({
                    data: {
                        request_type: 'receive_new_message',
                        user_id_from: data.user_id_from,
                        text: data.text
                    }
                }));
            }
        }

        result = global.api.setResult(
            true, '', { request_type: 'send_message' }
        );
    } catch(error) {
        result = global.api.setResult(
            false,
            error.message,
            { request_type: 'send_message' }
        );
    }

    // Отправка ответа на запрос
    ws.send(JSON.stringify(result));
};
