"use client";
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader, SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { UserProfile } from './accountComponents/profile';
import { AddressBook } from './accountComponents/addressBook';
import { NotificationTab } from './accountComponents/notifications';
import { UserReviews } from './accountComponents/reviews';
import { cn } from "@/lib/utils";
import CommonHeader from "@/app/components/Header";
import { useIsMobile } from '@/hooks/use-mobile';
import {Icons} from "./accountComponents/icons";

const TABS = [
    {
        value: 'profile',
        label: 'Profile',
        icon: Icons.user
    },
    {
        value: 'addresses',
        label: 'Addresses',
        icon: Icons.mapPin
    },
    {
        value: 'notifications',
        label: 'Notifications',
        icon: Icons.bell
    },
    {
        value: 'reviews',
        label: 'Reviews',
        icon: Icons.star
    }
];

export default function AccountPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [sheetOpen, setSheetOpen] = useState(false);
    const isMobile = useIsMobile();

    const renderTabContent = () => {
        switch(activeTab) {
            case 'profile':
                return <UserProfile />;
            case 'addresses':
                return <AddressBook />;
            case 'notifications':
                return <NotificationTab />;
            case 'reviews':
                return <UserReviews />;
            default:
                return null;
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (isMobile) {
            setSheetOpen(false);
        }
    };

    const NavigationItems = () => (
        <div className="flex flex-col gap-2 w-full">
            {TABS.map((tab) => (
                <Button
                    key={tab.value}
                    variant={activeTab === tab.value ? "secondary" : "ghost"}
                    className={cn(
                        "justify-start w-full rounded-none",
                        activeTab === tab.value && "bg-beige-200 text-accent-foreground"
                    )}
                    onClick={() => handleTabChange(tab.value)}
                >
                    <tab.icon className="mr-2 h-4 w-4" />
                    {tab.label}
                </Button>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <CommonHeader categoryVisibility="hidden" searchBarWidth="0"  isSearchAvailable={false}/>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 mt-24 md:grid-cols-4 gap-6">
                    {isMobile && (
                        <div className="fixed top-4 left-4 z-50">
                            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button size="icon" variant={"ghost"}>
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[280px] bg-beige-100">
                                    <SheetHeader>
                                        <SheetTitle>User Account </SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-10">
                                        <NavigationItems />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    )}

                    <Card className="hidden md:block h-fit rounded-none bg-beige-100">
                        <CardContent className="p-4">
                            <NavigationItems />
                        </CardContent>
                    </Card>

                    <div className="md:col-span-3">
                        <Card className="w-full rounded-none">
                            <CardHeader className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <CardTitle>{TABS.find(tab => tab.value === activeTab)?.label}</CardTitle>
                                </div>
                                <CardDescription>
                                    Manage your {activeTab.toLowerCase()} settings and information
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {renderTabContent()}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}