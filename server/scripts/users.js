let bcrypt = require('bcrypt');
// let salt = bcrypt.genSaltSync(10);
let salt = '$2b$10$pqaluQs0.dZeMlEcFIWpZO';

//console.log(bcrypt.hashSync('mercy', salt));

/**
 * Авторизация
 * */
exports.login = async (data) => {
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
      ]
    );

    if (!user) {
      throw Error('Не удалось авторизоваться, пользователь не найден.');
    }

    return global.api.setResult(true, '', user);
  } catch(e) {
    return global.api.setResult(false, e.message);
  }
};

/**
 * Данные пользователя
 * */
exports.getUser = async (user_id) => {
  let result = {};

  await global.db.any(
    `SELECT id, name FROM users WHERE id = $1`,
    [user_id]
  );

  return global.api.setResult();
};

/**
 * Получение списка пользователей, с которыми общался пользователь
 * */
exports.getUserCompanions = async (user_id) => {
  let result = {};

  try {
    let companions = {};

    let rows = await global.db.any(`
      SELECT
          distinct_companions.user_id_to,
          distinct_companions.user_id_from,
          distinct_companions.date,
          users_to.name AS user_to_name,
          users_from.name AS user_from_name
      FROM
      (
          SELECT
              DISTINCT ON(user_id_from, user_id_to)
              user_id_from,
              user_id_to,
              date
          FROM
               user_messages
          WHERE
              user_id_to = $1
              OR user_id_from = $1
          ORDER BY
              user_id_from, user_id_to
      ) distinct_companions
      JOIN users AS users_from ON users_from.id = distinct_companions.user_id_from
      JOIN users AS users_to ON users_to.id = distinct_companions.user_id_to
      ORDER BY
          distinct_companions.date DESC
    `, [
      user_id
    ]);

    if (rows) {
      rows.forEach((row) => {
        if (row.user_id_to !== user_id) {
          companions[row.user_id_to] = {
            id: row.user_id_to,
            name: row.user_to_name,
            messages: [],
            new_message: ''
          };
        }

        if (row.user_id_from !== user_id) {
          companions[row.user_id_from] = {
            id: row.user_id_from,
            name: row.user_from_name,
            messages: [],
            new_message: ''
          };
        }
      });
    }

    result = global.api.setResult(true, '', { companions });
  } catch(error) {
    result = global.api.setResult(false, 'Не удалось получить список собеседников');
  }

  return result;
};

/**
 * Загрузка/дозагрузка сообщений в переписке пользователя с компаньоном.
 * */
exports.getUserCompanionMessages = async (data) => {
  let result = {};

  let user_id = (data.user_id === undefined) ? false : parseInt(data.user_id);
  let companion_id = (data.companion_id === undefined) ? false : parseInt(data.companion_id);

  try {
    if (!user_id || !companion_id) {
      throw Error('Не указан пользователь или собеседник.');
    }

    let messages = await global.db.any(`
      SELECT
        user_id_from = $1 AS is_mine,
        message,
        date
      FROM
          user_messages
      WHERE
          (user_id_to = $2 AND user_id_from = $1)
          OR (user_id_to = $1 AND user_id_from = $2)
      ORDER BY date
      `, [
          user_id,
          companion_id
      ]
    );

    result = global.api.setResult(true, '', { messages });
  } catch(error) {
    result = global.api.setResult(false, 'Не удалось получить переписку.');
  }

  return result;
};
