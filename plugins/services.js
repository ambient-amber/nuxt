import { WebsocketService } from '~/services/websocket';

export default ({ app }, inject) => {
    const websocket = new WebsocketService();

    inject('websocket', websocket);
}
