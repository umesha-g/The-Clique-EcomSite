import {Client} from '@stomp/stompjs';
import {NotificationResponse} from "@/api/notification-api";
import SockJS from "sockjs-client";
import { Role, UserResponse} from "@/api/admin/admin-user-api";
import {prefix} from "@/utils/apiConfig";

class WebSocketService {
    private client: Client | null = null;
    private subscribers: ((notification: NotificationResponse) => void)[] = [];
    private connectionId: string = '';

    connect(user: UserResponse|null) {
        this.connectionId = `${user?.id}-${Date.now()}`;
        console.log(`Initializing WebSocket connection for ${user?.id || 'admin'} (${this.connectionId})`);

        this.client = new Client({
            webSocketFactory: () => new SockJS('/ws'),
            debug: (str) => {
                console.log(`[WebSocket ${this.connectionId}] ${str}`);
            },
            onConnect: () => {
                console.log(`[${this.connectionId}] Connected to WebSocket`);

                if (user?.role == Role.ADMIN) {
                    this.client?.subscribe('/admin/notifications', (message) => {
                        const notification: NotificationResponse = JSON.parse(message.body);
                        this.notifySubscribers(notification);
                    });
                } else if (user?.role == Role.USER) {
                    this.client?.subscribe(`/user/${user?.id}/notifications`, (message) => {
                        const notification: NotificationResponse = JSON.parse(message.body);
                        this.notifySubscribers(notification);
                    });
                }
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