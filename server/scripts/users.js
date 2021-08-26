let bcrypt = require('bcrypt');
// let salt = bcrypt.genSaltSync(10);
let salt = '$2b$10$pqaluQs0.dZeMlEcFIWpZO';

exports.login = async (data) => {
  let login = data.login === undefined ? false : data.login.trim();
  let password = data.password === undefined ? false : data.password;

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
        bcrypt.hashSync('moon', salt)
      ]
    );

    if (!user) {
      throw Error('Не удалось авторизоваться, пользователь не найден.');
    }

    return global.api.setResult(true, '', user);
  } catch(e) {
    return global.api.setResult(false, e.message);
  }
}

exports.getUser = async (user_id) => {
  let result = {};

  await global.db.any(
    `SELECT id, name FROM users WHERE id = $1`,
    [user_id]
  );

  return global.api.setResult();
};

exports.getUserMessages = async (user_id) => {
  await global.db.any(`
    SELECT

    FROM
        user_messages
    WHERE
        user_from_id = $1
        OR user_to_id = $1
  `, [user_id]);
}
