import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const API_URL = 'http://localhost:8080/api'; // Your API Gateway URL

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = new Map();
  }

  connect(onConnectCallback, onErrorCallback) {
    if (this.stompClient && this.stompClient.connected) {
      console.log('STOMP client is already connected.');
      if (onConnectCallback) onConnectCallback();
      return;
    }
    
    // Use SockJS as the WebSocket factory
    const socketFactory = () => new SockJS(`${API_URL}/ws`);

    this.stompClient = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      onConnect: () => {
        console.log('STOMP client connected');
        if (onConnectCallback) {
          onConnectCallback();
        }
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        if (onErrorCallback) {
          onErrorCallback(frame);
        }
      },
    });

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
      console.log('STOMP client disconnected');
      this.subscriptions.clear();
    }
  }

  subscribe(topic, callback) {
    if (this.stompClient && this.stompClient.connected) {
      if (this.subscriptions.has(topic)) {
        console.warn(`Already subscribed to ${topic}. Unsubscribing before creating new subscription.`);
        this.subscriptions.get(topic).unsubscribe();
      }
      
      const subscription = this.stompClient.subscribe(topic, (message) => {
        callback(JSON.parse(message.body));
      });
      
      this.subscriptions.set(topic, subscription);
      console.log(`Subscribed to ${topic}`);
    } else {
      console.error('Cannot subscribe, STOMP client is not connected.');
    }
  }

  unsubscribe(topic) {
    if (this.subscriptions.has(topic)) {
      this.subscriptions.get(topic).unsubscribe();
      this.subscriptions.delete(topic);
      console.log(`Unsubscribed from ${topic}`);
    }
  }

  sendMessage(destination, body) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('Cannot send message, STOMP client is not connected.');
    }
  }
}

// Export a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;