let bcrypt = require('bcrypt');
let salt = '$2b$10$pqaluQs0.dZeMlEcFIWpZO';

exports.login = async (ws, data, ws_connection_id) => {
    let result = {};
    let login = (data.login === undefined) ? false : data.login.trim();
    let password = (data.password === undefined) ? false : data.password;

    try {
        if (!login) {
            throw Error('Не указан логин.');
        }
        if (!password) {
            throw Error('Не указан пароль.');
        }

        let user = await global.db.oneOrNone(`
          SELECT
            id,
            name,
            login
          FROM
            users
          WHERE
            login = $1
            AND password = $2
        `, [
            login,
            bcrypt.hashSync(password, salt)
        ]);

        if (!user) {
            throw Error('Не удалось авторизоваться, пользователь не найден.');
        }

        global.ws_clients[ws_connection_id].user = user;

        result = global.api.setResult(
        true,
        '',
        {
            request_type: 'login',
            user
        });
    } catch(e) {
        result = global.api.setResult(false, e.message);
    }

    // Ответ запроса авторизации
    ws.send(JSON.stringify(result));
};
