import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
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
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        
        onConnect: (frame) => {
          console.log('WebSocket connected successfully');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Re-subscribe to all previous subscriptions
          this.subscriptions.forEach((callback, destination) => {
            this.subscribe(destination, callback);
          });
          
          if (callback) callback();
        },
        
        onStompError: (frame) => {
          console.error('STOMP protocol error:', frame.headers['message']);
          this.isConnected = false;
          this.handleReconnection();
        },
        
        onWebSocketError: (error) => {
          console.error('WebSocket connection error:', error);
          this.isConnected = false;
          this.handleReconnection();
        },
        
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
        }
      });

      this.client.activate();
      
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnected = false;
      this.handleReconnection();
    }
  }

  handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(), 5000);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  subscribe(destination, callback) {
    if (!destination || !callback) {
      console.error('Destination and callback are required for subscription');
      return null;
    }

    // Store subscription for reconnection
    this.subscriptions.set(destination, callback);
    
    if (this.client && this.client.connected) {
      try {
        const subscription = this.client.subscribe(destination, (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            callback(parsedMessage);
          } catch (parseError) {
            console.error('Error parsing WebSocket message:', parseError);
            console.log('Raw message:', message.body);
          }
        });
        console.log(`Subscribed to: ${destination}`);
        return subscription;
      } catch (error) {
        console.error('Error subscribing to destination:', destination, error);
      }
    } else {
      console.log('WebSocket not connected. Subscription will be active after connection.');
    }
    return null;
  }

  unsubscribe(destination) {
    this.subscriptions.delete(destination);
    console.log(`Unsubscribed from: ${destination}`);
    // Note: STOMP.js handles unsubscription automatically when connection is lost
  }

  sendMessage(destination, message) {
    if (this.client && this.client.connected) {
      try {
        this.client.publish({
          destination: destination,
          body: JSON.stringify(message)
        });
        console.log(`Message sent to ${destination}:`, message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.error('WebSocket not connected. Cannot send message.');
    }
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.clear();
      this.client.deactivate();
      this.isConnected = false;
      this.reconnectAttempts = 0;
      console.log('WebSocket disconnected');
    }
  }

  getConnectionStatus() {
    return this.isConnected && this.client && this.client.connected;
  }

  // Method to check if WebSocket is available (for CORS issues)
  isWebSocketAvailable() {
    try {
      return typeof WebSocket !== 'undefined' || (typeof SockJS !== 'undefined' && typeof Client !== 'undefined');
    } catch (error) {
      console.warn('WebSocket availability check failed:', error);
      return false;
    }
  }

  // Method to check if user is subscribed to a destination
  isSubscribed(destination) {
    return this.subscriptions.has(destination);
  }

  // Method to get all active subscriptions
  getActiveSubscriptions() {
    return Array.from(this.subscriptions.keys());
  }

  // Method to clear all subscriptions
  clearSubscriptions() {
    this.subscriptions.clear();
    console.log('All subscriptions cleared');
  }
}

export default new WebSocketService();