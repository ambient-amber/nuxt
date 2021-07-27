global.express = require('express');
global.websocket = require('ws');
global.router = express.Router();

const http = require('http');

const hostname = '192.168.0.14';
const port = 3000;

const app = express();

const server = http.createServer(app);
const ws_server = new websocket.Server({ server });

ws_server.on('connection', (websocket) => {
    //connection is up, let's add a simple simple event
    websocket.on('message', (message) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        websocket.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    websocket.send('Hi there, I am a WebSocket server');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.use('/api', require('./routes/chat'));
