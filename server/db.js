let db_settings = global.project_settings.db;
let auth_part = db_settings.user + ':' + db_settings.password;
let address_part = db_settings.host + ':' + db_settings.port;

const pgp = require('pg-promise')();
const connectionString = db_settings.provider + '://' + auth_part + '@' + address_part + '/' + db_settings.name;
const db = pgp(connectionString);

module.exports = db;
