const chat = require('./chat');

exports.route = async (ws, clients, data) => {
    data = JSON.parse(data);

    if (data.request_type) {
        if (data.request_type === 'send_message') {
            let result = await chat.sendMessage(data);

            console.log(result);

            if (result) {
                for (let key in clients) {
                    clients[key].send(JSON.stringify(data));
                }
            }
        }
    }
};
