import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
  }

  connect(callback) {
    const socket = new SockJS('http://localhost:8080/ws');
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket connected');
        callback();
      },
      onStompError: (error) => {
        console.error('WebSocket error:', error);
      },
    });
    this.client.activate();
  }

  subscribe(destination, callback) {
    if (this.client && this.client.connected) {
      this.client.subscribe(destination, (message) => {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      });
    } else {
      console.error('Cannot subscribe: WebSocket not connected');
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      console.log('WebSocket disconnected');
    }
  }
}

export default new WebSocketService();