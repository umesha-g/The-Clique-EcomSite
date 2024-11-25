"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {Clipboard, Folder, Menu, Package, Users} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from '@/components/ui/sidebar';
import BrandsPanel from './BrandsPanel';
import CategoriesPanel from './CategoriesPanel';
import DiscountsPanel from './DiscountsPanel';
import OrdersPanel from './OrdersPanel';
import ProductsPanel from './ProductsPanel';
import UsersPanel from './UsersPanel';
import {MdOutlineBrandingWatermark, MdOutlineDiscount} from "react-icons/md";
import {OverviewPanel} from "./OverviewPanel";
import {LuBarChart3} from "react-icons/lu";
import CommonHeader from "@/app/components/Header";

const DashboardMain: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { toggleSidebar } = useSidebar();

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewPanel/>;
            case 'orders':
                return <OrdersPanel />;
            case 'discounts':
                return <DiscountsPanel />;
            case 'categories':
                return <CategoriesPanel />;
            case 'brands':
                return <BrandsPanel />;
            case 'products':
                return <ProductsPanel />;
            case 'users':
                return <UsersPanel />;
            default:
                return <OverviewPanel />;
        }
    };

    return (
            <div className="min-h-screen w-full bg-beige-100">
                <div className="flex flex-col md:flex-row bg-beige-100">
                    <Sidebar variant="sidebar" collapsible="offcanvas" className={"rounded-none bg-beige-100" }>
                        <SidebarHeader>
                            <h2 className="text-xl font-bold text-center mb-10 mt-3 bg-beige-100">
                                Admin Dashboard
                            </h2>
                        </SidebarHeader>
                        <SidebarContent className={"ml-12 bg-beige-100"}>
                            <SidebarMenu className={"space-y-5"}>
                                <SidebarMenuItem className={"rounded-none"}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab('overview')}
                                        isActive={activeTab === 'overview'}
                                        className={"rounded-none"}
                                    >
                                        <LuBarChart3  className="text-sm mr-3" />
                                        <span >Overview</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem >
                                <SidebarMenuItem className={"rounded-none"}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab('orders')}
                                        isActive={activeTab === 'orders'}
                                        className={"rounded-none"}
                                    >
                                        <Clipboard className="text-sm mr-3" />
                                        <span >Orders</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem >
                                <SidebarMenuItem className={"rounded-none"}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab('discounts')}
                                        isActive={activeTab === 'discounts'}
                                        className={"rounded-none"}
                                    >
                                        <MdOutlineDiscount className="text-sm mr-3" />
                                        <span>Discounts</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem className={"rounded-none"}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab('categories')}
                                        isActive={activeTab === 'categories'}
                                        className={"rounded-none"}
                                    >
                                        <Folder className="text-sm mr-3" />
                                        <span>Categories</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem className={"rounded-none"}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab('brands')}
                                        isActive={activeTab === 'brands'}
                                        className={"rounded-none"}
                                    >
                                        <MdOutlineBrandingWatermark className="text-sm mr-3" />
                                        <span>Brands</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem className={"rounded-none"}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab('products')}
                                        isActive={activeTab === 'products'}
                                        className={"rounded-none"}
                                    >
                                        <Package className="text-sm mr-3" />
                                        <span>Products</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem className={"rounded-none"}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab('users')}
                                        isActive={activeTab === 'users'}
                                        className={"rounded-none"}
                                    >
                                        <Users className="text-sm mr-3" />
                                        <span>Users</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter>
                        </SidebarFooter>
                        <SidebarRail />
                    </Sidebar>
                    <SidebarInset className={"rounded-none"}>
                        <div>
                            <CommonHeader categoryVisibility={"hidden"} isSearchAvailable={false} searchBarWidth={""}/>
                            <SidebarTrigger className={"absolute left-5 top-4 z-50 justify-self-start p-5"} onClick={toggleSidebar}>
                                <Menu size="icon" />
                                <span className="sr-only">Toggle Sidebar</span>
                            </SidebarTrigger>
                        </div>
                        <div className="flex mt-24 mx-auto p-6 rounded-none">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className={"rounded-none"}
                                >
                                    {renderActiveTab()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </SidebarInset>
                </div>
            </div>
    );
};

export default DashboardMain;