global.project_settings = require('./settings');
global.db = require('./db');
global.api = require('./api');

const express = require('express');
const http = require('http');
const app = express();
const ws = require('ws');

// const hostname = '192.168.0.14';
const hostname = '127.0.0.1';
const port = 3030;

const server = http.createServer(app);
const wss = new ws.Server({ server });

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
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(express.json());
app.use('/api', require('./routes/users'));
