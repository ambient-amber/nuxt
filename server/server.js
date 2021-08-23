const ws = require('ws');
const wss = new ws.Server({ port: 8080 });

// подключенные клиенты
let clients = {};

wss.on('connection', function(ws) {
  let id = Math.random();

  clients[id] = ws;

  console.log("новое соединение " + id);

  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);

    for (let key in clients) {
      clients[key].send(message);
    }
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });
})

/*wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('connection');
});*/
