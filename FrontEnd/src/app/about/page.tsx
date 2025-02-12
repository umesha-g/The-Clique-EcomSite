import CommonHeader from "@/app/components/CommonHeader";
import {Card, CardContent} from "@/components/ui/card";
import CommonFooter from '../components/CommonFooter';
import React from "react";
import Image from "next/image";
import {FaGlobe, FaLinkedinIn} from "react-icons/fa";
import {TbBrandFiverr} from "react-icons/tb";

export default function NotFound() {
    return (
        <div>
            <div className=" min-h-screen bg-white flex-col">
                <CommonHeader categoryVisibility={"hidden"} searchBarWidth={"64"} isSearchAvailable={true}/>
                <div className={"flex flex-col items-center justify-center"}>
                    <Card className={"py-8 px-1 md:p-20 border my-[15vh] text-center rounded-none flex flex-col items-center justify-center"}>
                        <CardContent className={"max-w-[320px] sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-3xl 2xl:max-w-4xl "}>
                            <h1 className="text-2xl md:text-3xl font-bold text-beige-400 mb-6">About The Clique</h1>
                            <h2 className="text-sm sm:text-base md:text-lg text-neutral-800 mb-16 text-justify ">Welcome to The Clique, an innovative e-commerce platform crafted with care to practice full-stack development using Next.js and Spring Boot with MySQL. This project embodies the essence of modern e-commerce, offering nearly all the features you'd expect—minus order cancellations, disputes, and reviews, as no real deliveries are involved. Users can explore, add items to wishlists or carts, and even make mock purchases for an engaging shopping experience. For the administrator, The Clique provides a secure backend with advanced middleware and Spring Boot Security, enabling seamless management of categories, discounts, and products. Admins also gain access to comprehensive platform and product statistics, empowering data-driven decisions. Our platform features a stunning, elegant design powered by ShadCN components, ensuring a visually captivating experience for users. Whether you're here to shop, explore, or simply admire its structure and beauty, The Clique is a testament to high-quality craftsmanship and attention to detail.  </h2>

                            <div className={"flex space-x-6 items-center justify-center"}>
                                <div className="relative ring-2 ring-beige-400 w-[120px] md:w-32 aspect-square rounded-full p-1">
                                    <Image
                                        src={"/assets/about/about.jpg"}
                                        alt={"Umesha G."}
                                        className="w-full h-full object-cover rounded-full"
                                        width={200}
                                        height={200}
                                    />
                                </div>
                                <div className={"flex-col text-left justify-start"}>
                                    <p className="text-balance md:w-full font-semibold text-sm sm:text-base md:text-lg text-gray-900">
                                        G. Umesha Madushan
                                    </p>
                                    <p className="text-balance md:w-full text-xs sm:text-sm md:text-base text-gray-600 mb-1 md:mb-4">
                                        Graphic Designer and Software Developer
                                    </p>
                                    <div className={"flex space-x-4"}>
                                        <a href="https://www.linkedin.com/in/umeshag/" className={"bg-neutral-600 hover:bg-black aspect-square w-4 md:w-6 transition-all flex items-center justify-center ease-in-out rounded-sm"}>
                                            <FaLinkedinIn className={"text-white aspect-square w-2.5 md:w-5.5"} />
                                        </a>
                                        <a href="https://umesha-g.github.io/Portfolio-Site-Umesha_G/" className={"bg-neutral-600 hover:bg-black aspect-square w-4 md:w-6 transition-all flex items-center justify-center ease-in-out rounded-sm"}>
                                            <FaGlobe className={"text-white aspect-square w-2.5 md:w-5.5"} />
                                        </a>
                                        <a href="https://www.fiverr.com/umesha_g?up_rollout=true" className={"bg-neutral-600 hover:bg-black aspect-square w-4 md:w-6 transition-all flex items-center justify-center ease-in-out rounded-sm"}>
                                            <TbBrandFiverr className={"text-transparent fill-white aspect-square w-2.5 md:w-5.5"} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <CommonFooter height={"h-16"}/>
        </div>
    )
}