"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu-right";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export function UserMenu() {
  function handleLogOut(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <NavigationMenu className="m-0 p-0">
      <NavigationMenuList className="rounded-none">
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {
              <User className="text-neutral-700 w-5 h-5 hover:text-neutral-950 hover:fill-neutral-950 transition-all ease-in-out" />
            }
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[200px] lg:w-[300px] lg:grid-cols-[.75fr_1fr] ">
              <li className="row-span-4 w-[150px]">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-center items-center text-center content-center rounded-none p-3 no-underline border-b md:border-b-0 md:border-r border-neutral-700"
                    href="#"
                  >
                    <Avatar className=" ring-1 ring-offset-4 ring-neutral-700 h-20 w-20">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="mb-2 mt-4 text-md text-neutral-700 font-medium">
                      User Name
                    </div>
                    <p className="text-sm leading-tight text-neutral-700 text-muted-foreground">
                      email@abc.com
                    </p>
                    <button
                      onClick={handleLogOut}
                      className="px-4 py-1 text-sm rounded-none mt-5 border border-red-700 text-red-700 hover:bg-red-100 "
                    >
                      Log Out
                    </button>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="#" title="Purchase History"></ListItem>
              <ListItem href="#" title="Wishlist"></ListItem>
              <ListItem href="#" title="Track Order"></ListItem>
              <ListItem href="#" title="Help Center"></ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink className="rounded-none" asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-none text-left p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground ">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
