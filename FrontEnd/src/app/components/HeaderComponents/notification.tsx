"use client";
import React from 'react';
import { useNotifications } from '@/contexts/notificationContext';
import {AlertTriangle, Bell, CheckCircle2, Info, ShoppingCart, XCircle} from 'lucide-react';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {MdOutlineMarkEmailRead} from "react-icons/md";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {useIsMobile} from "@/hooks/use-mobile";

export const NotificationsButton: React.FC = () => {
    const { notifications, unreadCount, setMarkAsRead,refreshNotifications } = useNotifications();
    const isMobile = useIsMobile();

    const NotificationIcon = {
        ["SUCCESS"]: <CheckCircle2 className="text-green-500" size={28} />,
        ["WARNING"]: <AlertTriangle className="text-yellow-500" size={28}  />,
        ["ERROR"]: <XCircle className="text-red-500" size={28}  />,
        ["INFO"]: <Info className="text-blue-500" size={28}  />
    };

    const NotificationBody = () => (
        <div className="p-1">
            {/*<h3 className="text-lg text-neutral-900 font-semibold mb-4">Notifications</h3>*/}
            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[50vh] sm:h-[20vh] text-center px-4">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">No Notifications</h3>
                    <p className="text-sm text-neutral-500">You all caught up</p>
                </div>
            ) : (
                <div>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-3 mb-2 cursor-pointer rounded-none border text-balance border-neutral-600 ${
                                notification.read ? 'bg-gray-50' : 'bg-beige-100'
                            }`}
                        >
                            <div onClick={() => {
                                if (notification.link) {
                                    window.location.href = notification.link;
                                    setMarkAsRead(notification.id);
                                }
                            }}>
                                <div className={"flex items-center mb-3"}>
                                    <p className={"mr-2"}>{NotificationIcon[notification.type]}</p>
                                    <h4 className="font-medium text-black">{notification.title}</h4>
                                </div>
                                <p className="text-sm text-gray-800 mb-1">{notification.message_1}</p>
                                <p className="text-sm text-gray-800 mb-1">{notification.message_2}</p>
                                <p className="text-sm text-gray-800 mb-2">{notification.message_3}</p>
                            </div>
                            <span className="text-xs text-gray-600 flex justify-between">
                                {new Date(notification.createdAt).toLocaleString()}
                                {!notification.read && (
                                    <div
                                        onClick={() => setMarkAsRead(notification.id)}
                                        className="w-6 h-6 ml-20"
                                    >
                                        <MdOutlineMarkEmailRead
                                            size={30}
                                            className="text-neutral-600 cursor-pointer hover:text-neutral-900 transition-all ease-in-out"
                                            onClick={()=>setMarkAsRead(notification.id).then(()=>refreshNotifications())}
                                        />
                                    </div>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (

        !isMobile ? (
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
            <PopoverContent  className="mt-2 w-[380px] sm:w-[420px] bg-white rounded-none border border-black max-h-96 overflow-y-auto">
                <NotificationBody/>
            </PopoverContent >
        </Popover>
    ):( <Sheet>
        <SheetTrigger asChild>
            <button className=" relative">
                <Bell className="w-5 h-5 text-neutral-700 hover:text-neutral-950 hover:fill-neutral-950 transition-all ease-in-out" />
                {unreadCount > 0 && (
                    <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {unreadCount}
              </span>
                )}
            </button>
        </SheetTrigger>
            <SheetContent className={"w-full sm:max-w-md rounded-none"}>
                <SheetHeader className="border-b pb-4 px-6 -mx-6">
                    <SheetTitle className="flex items-center gap-2">
                        {/*<ShoppingCart className="w-5 h-5" />*/}
                        Notification
                    </SheetTitle>
                </SheetHeader>
                <NotificationBody/>
            </SheetContent>
        </Sheet> )
    );
};