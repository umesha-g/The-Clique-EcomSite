import React from "react";
import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar";
import {Bell, Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Card, CardContent, CardFooter} from "@/components/ui/card";

const Header: React.FC = () => {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="bg-white  p-4 flex justify-between shrink-0 items-center gap-2 border-b">
            <SidebarTrigger className={"justify-self-start p-5"} onClick={toggleSidebar}>
                <Menu size="icon" />
                <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
            <div className="flex items-center space-x-4 relative">

            </div>
        </header>
    );
};

export default Header;