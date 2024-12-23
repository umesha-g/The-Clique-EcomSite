import React from 'react';
import {useRouter} from "next/navigation";

const Logo: React.FC = () => {
    const router = useRouter();

    return (
        <button onClick={() => router.push("/home")}
             className="text-2xl flex space-x-3 items-center font-dmSerifDisplay font-medium relative -left-[1%] lg:absolute md:-left-[5%] lg:left-[43%] ">
            <hr className=" w-10 hidden lg:block border-y-[1px] border-neutral-700"></hr>
            <h1 className="text-neutral-700">The Clique</h1>
            <hr className=" w-10 hidden lg:block border-y-[1px] border-neutral-700"></hr>
        </button>
    );
}

export default Logo;
