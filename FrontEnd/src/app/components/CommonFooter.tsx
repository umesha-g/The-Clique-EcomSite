import React from 'react';
import {Separator} from "@/components/ui/separator";
import {MdCopyright} from "react-icons/md";

interface commonFooterProps {
    height:string;
}

const CommonFooter: React.FC<commonFooterProps> = ({height}) => {

    return (
        <footer className={`flex w-full bg-neutral-900 text-white justify-center items-center text-xs sm:text-sm font-light space-x-4 ${height} py-4`}>
            <h1 className="text-white text-sm sm:text-base font-dmSerifDisplay">The Clique</h1>
            <Separator orientation={"vertical"}/>
            <div className={"flex items-center space-x-2 "}>
               <p> Designed By Umesha G.</p> <MdCopyright /> 2024. <p className={"hidden sm:block"}>  All Rights Reserved</p>
            </div>
        </footer>
    );
}

export default CommonFooter;