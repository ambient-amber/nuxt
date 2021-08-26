/*
 * Copyright (c) 11.01.2021, 16:21
 * Автор: Тарасов Антон
 * E-mail: tarasov.ai@infotek.ru
 * Файл: api.js
 */

module.exports = {
    setResult: function(is_success, message = '', data = {}) {
        if (!message) {
            message = is_success ? 'Успешно' : 'Неудачно';
        }

        return {
            is_success: is_success,
            message: message,
            data: data,
        };
    }
}
