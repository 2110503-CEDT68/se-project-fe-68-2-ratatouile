import getRestaurant from "@/libs/getRestaurant";
import Image from "next/image";
// import Link from "next/link";

export default async function RestaurantDetailPage({params}:{params: Promise<{rid:string}>}) {

  const {rid} = await params;
  const restaurantDetail = await getRestaurant(rid);

  return (
    <main className="text-center p-5 pt-16">
      <h1 className="text-lg">{restaurantDetail.data.name}</h1>
      <div className="flex my-5">
        <Image src={restaurantDetail.data.picture} alt="Product Picture" width={0} height={0} sizes="100vw"
        className="rounded-lg w-[30%] bg-black" />
        <div className="flex flex-col text-left">
          <div className="text-md mx-5">Name: {restaurantDetail.data.name}</div>
          <div className="text-md mx-5">Address: {restaurantDetail.data.address}</div>
          <div className="text-md mx-5">District: {restaurantDetail.data.district}</div>
          <div className="text-md mx-5">Postal Code: {restaurantDetail.data.postalcode}</div>
          <div className="text-md mx-5">Tel: {restaurantDetail.data.tel}</div>
          <div className="text-md mx-5">Daily Rate: {restaurantDetail.data.dailyrate}</div>

          {/* <Link className="bg-black text-white py-2 px-3 rounded-md" href={`/booking?id=${vid}&venue=${venueDetail.data.name}`}>
            Booking
          </Link> */}
        </div>
      </div>
    </main>
  );
}