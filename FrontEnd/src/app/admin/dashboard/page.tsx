"use client";
import React, { useState } from 'react';
import {SidebarProvider} from '@/components/ui/sidebar';
import DashboardMain from "@/app/admin/dashboard/adminDashboard_Components/dashboardMain";

const AdminDashboard: React.FC = () => {

  return (
      <SidebarProvider>
        <DashboardMain/>
      </SidebarProvider>
  );
};

export default AdminDashboard;