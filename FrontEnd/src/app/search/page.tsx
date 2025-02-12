"use client";
import React, {Suspense} from "react";
import dynamic from "next/dynamic";
import CommonHeader from "@/app/components/CommonHeader";
import CommonFooter from "@/app/components/CommonFooter";

const SearchPage = () => {
    const SearchMain = dynamic(() => import('@/app/search/SearchComponents/searchMain'), {
        ssr: false
    });
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        }>
            <div className ="min-h-screen">
                <CommonHeader categoryVisibility="hidden" searchBarWidth="96"  isSearchAvailable={true}/>
                <SearchMain />
                <footer>
                    <CommonFooter height={"h-14"}/>
                </footer>
            </div>
        </Suspense>
    );
};

export default SearchPage;