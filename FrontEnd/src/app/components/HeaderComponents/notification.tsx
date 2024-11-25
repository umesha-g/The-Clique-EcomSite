"use client";
import React from 'react';
import { useNotifications } from '@/contexts/notificationContext';
import {AlertTriangle, Bell, CheckCircle2, Info, XCircle} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {ScrollArea} from "@/components/ui/scroll-area";

export const NotificationsButton: React.FC = () => {
    const { notifications, unreadCount, setMarkAsRead } = useNotifications();

    const NotificationIcon = {
        ["SUCCESS"]: <CheckCircle2 className="text-green-500" size={28} />,
        ["WARNING"]: <AlertTriangle className="text-yellow-500" size={28}  />,
        ["ERROR"]: <XCircle className="text-red-500" size={28}  />,
        ["INFO"]: <Info className="text-blue-500" size={28}  />
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className=" relative"
                >
                    <Bell className="w-5 h-5 text-neutral-700 hover:text-neutral-950 hover:fill-neutral-950 transition-all ease-in-out" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {unreadCount}
              </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent  className="mt-2 w-[420px] bg-white rounded-none border border-black max-h-96 overflow-y-auto">
                <div className="p-1">
                    <h3 className="text-lg text-neutral-900 font-semibold mb-4">Notifications</h3>
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No notifications</p>
                    ) : (
                        <div>
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 mb-2 cursor-pointer rounded-none border border-neutral-600 ${
                                        notification.read ? 'bg-gray-50' : 'bg-beige-100'
                                    }`}
                                    onClick={() => {
                                        if (!notification.read) {
                                            setMarkAsRead(notification.id);
                                        }
                                        if (notification.link) {
                                            window.location.href = notification.link;
                                        }
                                    }}
                                >
                                    <div className={"flex items-center mb-5"}>
                                        <p className={"mr-2"}>{NotificationIcon[notification.type]}</p>
                                        <h4 className="font-medium text-black">{notification.title}</h4>
                                    </div>
                                    <p className="text-sm text-gray-800 mb-1">{notification.message_1}</p>
                                    <p className="text-sm text-gray-800 mb-1">{notification.message_2}</p>
                                    <p className="text-sm text-gray-800 mb-2">{notification.message_3}</p>
                                    <span className="text-xs text-gray-600">
                                      {new Date(notification.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent >
        </Popover>
    );
};