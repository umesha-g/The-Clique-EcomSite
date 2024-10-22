'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import BrandsPanel from './adminDashboard_Components/BrandsPanel';
import CategoriesPanel from './adminDashboard_Components/CategoriesPanel';
import DiscountsPanel from './adminDashboard_Components/DiscountsPanel';
import OrdersPanel from './adminDashboard_Components/OrdersPanel';
import ProductsPanel from './adminDashboard_Components/ProductsPanel';
import UsersPanel from './adminDashboard_Components/UsersPanel';

const Header: React.FC = () => (
  <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <nav>{/* Add navigation items here if needed */}</nav>
    </div>
  </header>
);

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 rounded-none mb-6">
            <TabsTrigger
              value="orders"
              className="rounded-none transition-colors"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="discounts"
              className="rounded-none transition-colors"
            >
              Discounts
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="rounded-none transition-colors"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger
              value="brands"
              className="rounded-none transition-colors"
            >
              Brands
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="rounded-none transition-colors"
            >
              Products
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="rounded-none transition-colors"
            >
              Users
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={tabVariants}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="orders">
                <OrdersPanel />
              </TabsContent>
              <TabsContent value="discounts">
                <DiscountsPanel />
              </TabsContent>
              <TabsContent value="categories">
                <CategoriesPanel />
              </TabsContent>
              <TabsContent value="brands">
                <BrandsPanel />
              </TabsContent>
              <TabsContent value="products">
                <ProductsPanel />
              </TabsContent>
              <TabsContent value="users">
                <UsersPanel />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
