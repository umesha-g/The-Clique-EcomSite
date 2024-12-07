"use client";
import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu-left";
import { cn } from "@/lib/utils";
import {TbCategory} from "react-icons/tb";
import {useEffect, useState} from "react";
import {getAllCategories} from "@/api/category-api";
import {MiniCategoryResponse} from "@/api/admin/admin-category-api";
import {createCategorySlug} from "@/utils/categorySlug";

const CategoriesMenu  = () => {
    const [categories, setCategories] = useState<MiniCategoryResponse[]>([]);

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(()=> {
        fetchCategories();
    },[]);

  return (
    <NavigationMenu>
      <NavigationMenuList className="rounded-none">
        <NavigationMenuItem className="rounded-none">
          <NavigationMenuTrigger className="text-neutral-700 text-md rounded-none hover:text-neutral-900 focus:bg-transparent">
          <TbCategory className="w-5 h-5 text-neutral-700 hover:text-neutral-950 fill-transparent hover:fill-neutral-950 transition-all ease-in-out" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="rounded-none left-0">
            <ul className="grid w-[200px] rounded-none gap-3 p-4 md:w-[300px] md:grid-cols-3 lg:w-[400px] text-lg">
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  href={`/category/${createCategorySlug(category.name,category.id)}/`}
                >
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(({
                                                                                                 className,
                                                                                                 title,
                                                                                                 children,
                                                                                                 ...props },
                                                                                               ref) => {
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

export default CategoriesMenu;
