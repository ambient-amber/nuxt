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

        /*return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if (ws.readyState === 1) {
                    clearInterval(timer);
                    // this.$store.commit('ws/setConnection', ws);
                    resolve();
                }
            }, 10);
        });*/
    }

    /**
     * Обработка ответа на запрос, выполнение колбэка
     * */
    catchMessage() {
        this.websocket.onmessage = (event) => {
            let response_data = JSON.parse(event.data);

            console.log('response_data', response_data);
            console.log('this.observers', this.observers);

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

    /*subscribe(fn) {
        this.observers.push(fn);
    }*/
}
