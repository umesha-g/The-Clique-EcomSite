"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { webSocketService } from '@/utils/webSocketService';
import {getUnreadNotifications, markAsRead, NotificationResponse, NotificationType} from "@/api/notification-api";
import {useAuth} from "@/contexts/authContext";
import { useToast} from "@/hooks/use-toast";

type NotificationsContextType = {
    notifications: NotificationResponse[];
    unreadCount: number;
    setMarkAsRead: (id: string) => Promise<void>;
    soundEnabled: boolean;
    toggleSound: () => void;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Create an audio element for notification sound
const notificationSound = typeof window !== 'undefined'
    ? new Audio('/assets/notifications/pop.mp3')
    : null;

export const NotificationsProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children}) => {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const{user} = useAuth();
    const { toast } = useToast()

    const playNotificationSound = () => {
        if (soundEnabled && notificationSound) {
            notificationSound.play().catch(error => {
                console.error('Failed to play notification sound:', error);
            });
        }
    };

    const getToastVariant = (type: NotificationType): "default" | "destructive" => {
        switch (type) {
            case 'ERROR':
                return 'destructive';
            case 'WARNING':
                return 'destructive';
            default:
                return 'default';
        }
    };

    const showToast = (notification: NotificationResponse) => {

        const toastVariant = getToastVariant(notification.type);

        toast({
            title: notification.title,
            description: notification.message_1,
            variant: toastVariant,
        })
    };

    useEffect(() => {
        webSocketService.connect(user?.id);

        const unsubscribe = webSocketService.subscribe((notification) => {
            setNotifications(prev => [notification, ...prev]);

            playNotificationSound();
            showToast(notification);
        });

        fetchUnreadNotifications();

        return () => {
            unsubscribe();
            webSocketService.disconnect();
        };
    }, [user?.id]);

    const fetchUnreadNotifications = async () => {
        try {
            const data = await getUnreadNotifications();
            if (data) {
                setNotifications(data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const setMarkAsRead = async (id: string) => {
        try {
            const data = await markAsRead(id);

            if (data) {
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === id ? { ...notif, read: true } : notif
                    )
                );
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const toggleSound = () => {
        setSoundEnabled(prev => !prev);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                unreadCount,
                setMarkAsRead,
                soundEnabled,
                toggleSound
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};