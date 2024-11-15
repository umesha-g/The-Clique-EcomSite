import React from "react";
import {SidebarTrigger, useSidebar} from "@/components/ui/sidebar";
import {Bell, Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";

const Header: React.FC = () => {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="bg-white  p-4 flex justify-between shrink-0 items-center gap-2 border-b">
            <SidebarTrigger className={"justify-self-start p-5"} onClick={toggleSidebar}>
                <Menu size="icon" />
                <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
            <div className="flex items-center space-x-4 relative">
                <Popover>
                    <PopoverTrigger asChild>
                <Button className={"justify-self-end"} variant="ghost" size="icon">
                    <div className={"bg-red-600 absolute z-20 rounded-full w-5 h-5 top-0 right-0"}><p className={"text-white text-sm"}>5</p></div>
                    <Bell size={20} />
                </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-100 min-w-80 max-h-96 p-4 mr-4 rounded-none">
                        <Card className={"max-h-80 p-0 border-none rounded-none shadow-none"}>
                            <CardContent className="grid gap-4 p-0 max-h-72 border-y overflow-y-scroll">
                                    <div className="space-y-2 p-2 border-b">
                                        <h4 className="font-medium leading-none">New Order</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Order Content.
                                        </p>
                                    </div>
                                    <div className="space-y-2 p-2 border-b">
                                        <h4 className="font-medium leading-none">New Order</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Order Content.
                                        </p>
                                    </div>
                                    <div className="space-y-2 p-2 border-b">
                                        <h4 className="font-medium leading-none">New Order</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Order Content.
                                        </p>
                                    </div>
                                    <div className="space-y-2 p-2 border-b">
                                        <h4 className="font-medium leading-none">New Order</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Order Content.
                                        </p>
                                    </div>
                                    <div className="space-y-2 p-2 border-b">
                                        <h4 className="font-medium leading-none">New Order</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Order Content.
                                        </p>
                                    </div>
                            </CardContent>
                            <CardFooter className={"p-0 m-0 h-6 flex items-baseline justify-start text-left"}>
                                <Button className={"text-gray-500 text-sm p-0 m-0 "} variant={"link"}>Mark all as Read</Button>
                            </CardFooter>
                        </Card>

                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
};

export default Header;