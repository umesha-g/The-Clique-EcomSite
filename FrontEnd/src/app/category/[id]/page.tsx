import CommonHeader from "@/app/components/Header";
import CategoryMain from "./categoryComponents/categoryMain";

export default async function CategoryPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <CommonHeader
                categoryVisibility={"visible"}
                searchBarWidth={"64"}
                isSearchAvailable={true}
            />
            <CategoryMain categoryId={params.id} />
        </div>
    );
}