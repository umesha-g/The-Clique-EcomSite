import CommonHeader from "@/app/components/CommonHeader";
import CategoryMain from "./categoryComponents/categoryMain";
import {extractIdFromSlug} from "@/utils/categorySlug";
import CommonFooter from "@/app/components/CommonFooter";
import React from "react";

export default async function CategoryPage({params}: { params: { categorySlug: string } }) {
    const id = extractIdFromSlug(params.categorySlug);
    return (
        <div>
            <CommonHeader
                categoryVisibility={"visible"}
                searchBarWidth={"64"}
                isSearchAvailable={true}
            />
            <CategoryMain categoryId={id} />
            <footer>
                <CommonFooter height={"h-14"}/>
            </footer>
        </div>
    );
}
