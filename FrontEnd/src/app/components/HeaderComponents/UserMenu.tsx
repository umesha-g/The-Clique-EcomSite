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
import {useEffect, useState} from "react";
import {createUserSlug} from "@/utils/userSlug";
import {prefix} from "@/utils/apiConfig";
import {useAuth} from "@/contexts/authContext";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

const UserMenu:React.FC = () => {
  const {user, isAdmin, logout  } = useAuth();
  const[userSlug,setUserSlug]=useState<string|null>(null);
  const router = useRouter();

  const handleLoginClick =()=>{
    const callbackUrl = window.location.pathname;
    router.push(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  useEffect(() => {
        if(user){
          setUserSlug(createUserSlug(user.id, user.firstName))
        }
  }, [user]);

  if(user == null) {
    return (
        <Button
            onClick={()=>handleLoginClick()}
            variant={"default"}
            className={"border-neutral-900 rounded-full hover:bg-beige-300 border text-neutral-900 bg-white"}
        >
          Sign In
        </Button>
      );
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
            <ul className="grid gap-3 py-4 pl-0 md:w-[200px] lg:w-[340px] lg:grid-cols-[.75fr_1fr] ">
              <li className="row-span-4 px-3 w-[180px]">
                <NavigationMenuLink asChild>
                  <div  className="grid grid-cols-1 h-full w-auto justify-center rounded-none pr-3 no-underline  border-b lg:border-b-0 lg:border-r border-neutral-700">
                    <div className={"flex flex-col items-center justify-center bg-beige-100 px-0 py-6"}>
                      <a href={`/user/${userSlug}/account`}>
                        <Avatar className=" ring-1 ring-offset-4 ring-neutral-700 h-20 w-20">
                          <AvatarImage
                              src={prefix + user.userDPUrl}
                              alt={user.firstName}
                          />
                          <AvatarFallback>DP</AvatarFallback>
                        </Avatar>
                        <div className="mb-2 mt-4 text-md text-center text-neutral-700 font-medium">
                          {user.firstName}<br/>{user.lastName}
                        </div>
                        <p className="text-sm leading-tight text-neutral-700 text-muted-foreground">

                        </p>
                      </a>
                      <button
                          onClick={logout}
                          className="px-4 py-1 text-sm rounded-none mt-5 border border-red-700 text-red-700 hover:bg-red-100 "
                      >
                        Log Out
                      </button>
                    </div>
                </div>
                </NavigationMenuLink>
              </li>
              {isAdmin ? (
                  <ListItem href={`/admin/dashboard`} title="Dashboard"></ListItem>
              ):(
                  <div className={"mt-1 space-y-2"}>
                    <ListItem href={`/user/${userSlug}/orders`} title="My Orders"></ListItem>
                    <ListItem href={`/user/${userSlug}/wishlist`} title="My Wishlist"></ListItem>
                    <ListItem href="#" title="Track Order"></ListItem>
                    <ListItem href="#" title="Help Center"></ListItem>
                  </div>
              )}
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

export default UserMenu;