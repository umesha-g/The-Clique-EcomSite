"use client";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Clipboard, Folder, Package, Users } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider, SidebarRail,
} from '@/components/ui/sidebar';
import BrandsPanel from './adminDashboard_Components/BrandsPanel';
import CategoriesPanel from './adminDashboard_Components/CategoriesPanel';
import DiscountsPanel from './adminDashboard_Components/DiscountsPanel';
import OrdersPanel from './adminDashboard_Components/OrdersPanel';
import ProductsPanel from './adminDashboard_Components/ProductsPanel';
import UsersPanel from './adminDashboard_Components/UsersPanel';
import {MdOutlineBrandingWatermark, MdOutlineDiscount} from "react-icons/md";
import Header from "./adminDashboard_Components/Header";
import {OverviewPanel} from "@/app/admin/dashboard/adminDashboard_Components/OverviewPanel";
import {LuBarChart3} from "react-icons/lu";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
        return <OrdersPanel />;
    }
  };

  return (
      <SidebarProvider>
        <div className="min-h-screen w-full bg-gray-100">
          <div className="flex flex-col md:flex-row">
            <Sidebar variant="sidebar" collapsible="offcanvas" className={"rounded-none" }>
              <SidebarHeader>
                <h2 className="text-xl font-bold text-center mb-10 mt-3">
                  Admin Dashboard
                </h2>
              </SidebarHeader>
              <SidebarContent className={"ml-12 "}>
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
              <Header />
              <main className="flex mx-auto p-6 rounded-none">
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
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
  );
};

export default AdminDashboard;