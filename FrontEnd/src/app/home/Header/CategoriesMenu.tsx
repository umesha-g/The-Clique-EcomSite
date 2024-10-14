"use client";

import * as React from "react";

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu-left";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
//import { FaUser } from "react-icons/fa";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "T-Shirt",
    href: "#",
    description: "",
  },
  {
    title: "Trousers",
    href: "#",
    description: "",
  },
  {
    title: "Frocks",
    href: "#",
    description: "",
  },
  {
    title: "Tank Tops",
    href: "#",
    description: "",
  },
  {
    title: "Shirt",
    href: "#",
    description: "",
  },
];

export function CategoriesMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="rounded-none">
        <NavigationMenuItem className="rounded-none">
          <NavigationMenuTrigger className="text-neutral-700 text-md rounded-none hover:bg-transparent focus:bg-transparent">
          <Menu className="w-5 h-5 text-neutral-700 md:hidden hover:text-neutral-950 transition-all ease-in-out" />
            <p className="hidden md:block">Categories</p>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="rounded-none left-0">
            <ul className="grid w-[200px] rounded-none gap-3 p-4 md:w-[300px] md:grid-cols-3 lg:w-[400px] text-lg">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
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
            "block select-none space-y-1 rounded-none text-center p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
