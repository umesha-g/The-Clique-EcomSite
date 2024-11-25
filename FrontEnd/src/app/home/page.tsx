"use client";
import React, {useEffect, useState} from "react";
import BestSellingSection from "./BestSellingSection/BestSellingSection";
import FeaturedSection from "./FeaturedSection/FeaturedSection";
import HomeFooter from "./Footer/Footer";
import HeroSection from "./HeroSection/HeroSection";
import TestimonialSection from "./TesimonialSection/TestimonialSection";
import TrendingSection from "./TrendingSection/TrendingSection";
import CommonHeader from "@/app/components/Header";

const HomePage: React.FC = () => {
    const [isReloaded, setIsReloaded] = useState(false);

    useEffect(() => {
        // Only run on client-side
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);

            if (!searchParams.has('r')) {
                window.location.href = window.location.href +
                    (window.location.href.includes('?') ? '&' : '?') +
                    'r=true';
            } else {
                setIsReloaded(true);
            }
        }
    }, []);

    if (isReloaded) {
        return (
            <div className="min-h-screen text-gray-600 bg-white">
                <div>
                    <CommonHeader categoryVisibility={"visible"}
                                  searchBarWidth={"48"}
                                  isSearchAvailable={true}/>

                    <main className="relative">
                        <section>
                            <HeroSection/>
                        </section>

                        <section className="relative md:-top-28 lg:-top-48 left-0 right-0 z-20">
                            <FeaturedSection/>
                        </section>

                        <section className="container relative md:-top-28 lg:-top-40 left-0 right-0 mx-auto px-4 py-12">
                            <BestSellingSection/>
                        </section>

                        <section className="relative md:-top-24 lg:-top-28 left-0 right-0 mx-auto ">
                            <TestimonialSection/>
                        </section>

                        <section className="container relative md:-top-20 lg:-top-16 left-0 right-0 mx-auto px-4 py-12">
                            <TrendingSection/>
                        </section>
                    </main>

                    <footer className="py-8 bg-neutral-800">
                        <HomeFooter/>
                    </footer>
                </div>
            </div>
        );
    }else{
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        )
    }
}

export default HomePage;
