import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = new Map();
  }

  connect(callback) {
    // Don't reconnect if already connected
    if (this.isConnected && this.client && this.client.connected) {
      console.log('WebSocket already connected');
      if (callback) callback();
      return;
    }

    // Only disconnect if we're creating a new connection
    if (this.client && !this.isConnected) {
      this.client.deactivate();
    }

    try {
      const socket = new SockJS('http://localhost:8080/ws');
      this.client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          // Re-subscribe to all previous subscriptions
          this.subscriptions.forEach((callback, destination) => {
            this.client.subscribe(destination, (message) => {
              const parsedMessage = JSON.parse(message.body);
              callback(parsedMessage);
            });
          });
          if (callback) callback();
        },
        onStompError: (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
        },
        onWebSocketError: (error) => {
          console.error('WebSocket connection error:', error);
          this.isConnected = false;
        }
      });
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnected = false;
      return;
    }
    this.client.activate();
  }

  subscribe(destination, callback) {
    // Store subscription for reconnection
    this.subscriptions.set(destination, callback);
    
    if (this.client && this.client.connected) {
      this.client.subscribe(destination, (message) => {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      });
    } else {
      console.log('WebSocket not connected, subscription will be active after connection');
    }
  }

  unsubscribe(destination) {
    this.subscriptions.delete(destination);
    if (this.client && this.client.connected) {
      // Note: STOMP.js doesn't have a direct unsubscribe method
      // The subscription will be cleaned up when connection is lost
    }
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.isConnected = false;
      this.subscriptions.clear();
      console.log('WebSocket disconnected');
    }
  }

  // Method to check if WebSocket is available (for CORS issues)
  isWebSocketAvailable() {
    try {
      return typeof WebSocket !== 'undefined' || typeof SockJS !== 'undefined';
    } catch (error) {
      return false;
    }
  }
}

export default new WebSocketService();