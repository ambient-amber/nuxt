exports.sendMessage = async (data) => {
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

        result = global.api.setResult(true, '', data);
    } catch(error) {
        result = global.api.setResult(
            false,
            error.message
        );
    }

    return result;
};
