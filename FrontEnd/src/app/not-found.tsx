import Link from 'next/link'
import CommonHeader from "@/app/components/CommonHeader";
import {Card, CardContent} from "@/components/ui/card";

export default function NotFound() {
    return (
        <div className=" min-h-screen bg-white flex-col">
            <CommonHeader categoryVisibility={"hidden"} searchBarWidth={"64"} isSearchAvailable={true}/>
            <div className={"flex flex-col items-center justify-center"}>
                <Card className={"py-8 px-1 md:p-20 border mt-[25vh] text-center rounded-none flex flex-col items-center justify-center"}>
                    <CardContent className={" "}>
                        <h1 className="text-5xl md:text-8xl font-bold text-beige-300 mb-2">404</h1>
                        <h1 className="text-xl md:text-2xl font-semibold text-black mb-4">Page Not Found</h1>
                        <p className="w-64 text-balance md:w-full text-sm md:text-lg text-gray-500 mb-6">
                            Oops! The page you are looking for does not exist.
                        </p>
                        <Link
                            href="/home/"
                            className="px-4 py-2 bg-neutral-950 text-white rounded-none hover:bg-neutral-800 transition"
                        >
                            Return to Home
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}