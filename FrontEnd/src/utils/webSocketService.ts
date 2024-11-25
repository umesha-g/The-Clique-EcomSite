import { Client } from '@stomp/stompjs';
import { NotificationResponse } from "@/api/notification-api";
import SockJS from "sockjs-client";

class WebSocketService {
    private client: Client | null = null;
    private subscribers: ((notification: NotificationResponse) => void)[] = [];
    private connectionId: string = '';

    connect(userId?: string) {
        this.connectionId = `${userId}-${Date.now()}`;

        console.log(`Initializing WebSocket connection for ${userId || 'admin'} (${this.connectionId})`);

        this.client = new Client({
            webSocketFactory: () => new SockJS('http://192.168.1.100:8080/ws'),
            debug: (str) => {
                console.log(`[WebSocket ${this.connectionId}] ${str}`);
            },
            onConnect: () => {
                console.log(`[${this.connectionId}] Connected to WebSocket`);

                if (userId) {
                    this.client?.subscribe(`/user/${userId}/notifications`, (message) => {
                        console.log(`[${this.connectionId}] Received user notification:`, message.body);
                        const notification: NotificationResponse = JSON.parse(message.body);
                        this.notifySubscribers(notification);
                    });
                }

                this.client?.subscribe('/admin/notifications', (message) => {
                    console.log(`[${this.connectionId}] Received admin notification:`, message.body);
                    const notification: NotificationResponse = JSON.parse(message.body);
                    this.notifySubscribers(notification);
                });
            },
            onDisconnect: () => {
                console.log(`[${this.connectionId}] Disconnected from WebSocket`);
            },
            onStompError: (frame) => {
                console.error(`[${this.connectionId}] STOMP error`, frame);
            },

            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            console.log(`[${this.connectionId}] Disconnecting WebSocket`);
            this.client.deactivate();
            this.client = null;
            this.subscribers = [];
        }
    }

    subscribe(callback: (notification: NotificationResponse) => void) {
        console.log(`[${this.connectionId}] New subscriber added`);
        this.subscribers.push(callback);
        return () => {
            console.log(`[${this.connectionId}] Subscriber removed`);
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notifySubscribers(notification: NotificationResponse) {
        console.log(`[${this.connectionId}] Notifying ${this.subscribers.length} subscribers`);
        this.subscribers.forEach(callback => callback(notification));
    }

    isConnected(): boolean {
        return this.client?.connected ?? false;
    }
}

export const webSocketService = new WebSocketService();