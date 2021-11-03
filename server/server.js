global.project_settings = require('./settings');
global.db = require('./db');
global.api = require('./api');

const ws_router = require('./ws_scripts/router');

const express = require('express');
const http = require('http');
const app = express();
const ws = require('ws');

// const hostname = '192.168.0.14';
const hostname = '127.0.0.1';
const port = 3030;

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

app.use(express.json());
app.use('/api', require('./routes/users'));

/* --- WebSockets --- */
const wss = new ws.Server({ server });

// ToDo подумать как лучше хранить пользователей с их соединениями.
global.ws_clients = {};

wss.on('connection', function(ws) {
  let ws_connection_id = Math.random();
  console.log("новое соединение " + ws_connection_id);

  global.ws_clients[ws_connection_id] = {
    ws,
    user: null
  };

  ws.on('message', async (data) => {
    await ws_router.route(ws, data, ws_connection_id);
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + ws_connection_id);
    delete global.ws_clients[ws_connection_id];
  });
});
/* ----------------- */
