"use client";
import {Suspense} from "react";
import dynamic from "next/dynamic";
import CommonHeader from "@/app/components/Header";

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
            <CommonHeader categoryVisibility="hidden" searchBarWidth="96"  isSearchAvailable={true}/>
            <SearchMain />
        </Suspense>
    );
};

export default SearchPage;