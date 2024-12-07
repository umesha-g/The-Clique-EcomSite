import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import {
    getAllNotifications,
    markAsRead,
    NotificationResponse,
} from '@/api/notification-api';
import { MdOutlineMarkEmailRead} from "react-icons/md";
import {useRouter} from "next/navigation";

const NotificationIcon = {
    ["SUCCESS"]: <CheckCircle2 className="text-green-500" size={32} />,
    ["WARNING"]: <AlertTriangle className="text-yellow-500" size={32}  />,
    ["ERROR"]: <XCircle className="text-red-500" size={32}  />,
    ["INFO"]: <Info className="text-blue-500" size={32}  />
};
export const NotificationTab = () => {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const allNotifications = await getAllNotifications();
            setNotifications(allNotifications);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    return (
        <div className="space-y-4 overflow-scroll h-[700px]">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="flex-col items-start space-y-4 p-4 border rounded-none bg-background hover:bg-accent transition-colors"
                >
                    <div className={"flex justify-between"}>
                        <div onClick = {() => router.push(notification.link as string)} className=" h-12 flex space-x-4 items-center">
                            <p>{NotificationIcon[notification.type]}</p>
                            <p className="font-semibold">{notification.title}</p>
                        </div>

                        {!notification.read && (
                            <div
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="w-10 h-10"
                            >
                                <MdOutlineMarkEmailRead size={30} className="text-neutral-600 cursor-pointer hover:text-neutral-900 transition-all ease-in-out" />
                            </div>
                        )}
                    </div>
                    <div onClick = {() => router.push(notification.link as string)} className="flex-col flex space-y-2">
                        <p className="text-muted-foreground text-sm">{notification.message_1}</p>
                        <p className="text-muted-foreground text-sm">{notification.message_2}</p>
                        <p className="text-muted-foreground text-sm">{notification.message_3}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                        </p>
                    </div>

                </div>
            ))}
            {notifications.length === 0 && (
                <div className="text-center text-muted-foreground p-8">
                    No notifications
                </div>
            )}
        </div>
    );
};