import Link from "next/link";
import Card from "./Card";
import { RestaurantItem,RestaurantJson} from "../../interface";

export default async function RestaurantCatalog({restaurantsJson}:{restaurantsJson:Promise<RestaurantJson>}) {
    return (
    <div className="p-5 pt-16">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5 p-5 justify-items-center">
            {(await restaurantsJson).data.map((restaurantItem:RestaurantItem)=>(
                <Link href={`/restaurant/${restaurantItem.id}`} className="w-[305px]" key={restaurantItem.id}>
                    <Card key={restaurantItem.id} restaurantName={restaurantItem.name} imgSrc={restaurantItem.picture || "https://placehold.co/600x400/1A1814/D9C89C?text=No+Image"}/>
                </Link>
        ))}
        </div>
    </div>
  );
}
