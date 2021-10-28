export class WebsocketService {
    constructor() {
        this.observers = {};
        this.websocket = null;

        this.connectToServer();
    }

    connectToServer() {
        if (!this.websocket) {
            this.websocket = new WebSocket('ws://localhost:3030/');
        }

        this.websocket.onopen = () => {
            this.catchMessage();
        }
    }

    /**
     * Обработка ответа на запрос, выполнение колбэка
     * */
    catchMessage() {
        this.websocket.onmessage = (event) => {
            let response_data = JSON.parse(event.data);

            if (this.observers[response_data.request_type] !== undefined) {
                this.observers[response_data.request_type](response_data);
            }
        }
    }

    /**
     * Отправка запроса, подписка на результат запроса.
     * */
    async send(data, callback) {
        this.websocket.send(JSON.stringify(data));
        this.observers[data.request_type] = callback;
    }

    /**
     * Подписка на ответы.
     * */
    subscribe(data, callback) {
        this.observers[data.request_type] = callback;
    }
}
