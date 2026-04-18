import getRestaurants from "@/libs/getRestaurants";
// import CardPanel from "@/components/CardPanel";
import RestaurantCatalog from "@/components/RestaurantCatalog";

export default async function Venues() {
  const restaurants = await getRestaurants();
  return (
    <main>
      {/* <CardPanel/> */}
      <RestaurantCatalog restaurantsJson={restaurants}/>
    </main>
  );
}