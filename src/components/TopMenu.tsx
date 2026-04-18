import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";


export default async function TopMenu() {

  const session = await getServerSession(authOptions);

  console.log(session);
  

  return (
    <main className="flex bg-[#E6DDC4]  text-[#59200D] h-13 top-0 left-0 right-0 gap-5 fixed justify-between items-center z-2">

      <div className="relative h-12 w-12 ml-2">
          <Image src="/LogoDark.png" alt="logo" fill className="object-contain"/>
      </div>


      <div className="absolute flex gap-10 left-1/2 -translate-x-1/2">
        <TopMenuItem title="Home" pageRef="/"/>
        <TopMenuItem title="Reservation" pageRef="/booking"/>
        <TopMenuItem title="Restaurants" pageRef="/restaurants"/>
        {session?.user?.role==="admin" ? (
          <TopMenuItem title="Dashboard" pageRef="/dashboard"/>
        ):<TopMenuItem title="My Booking" pageRef="/mybooking"/>}
      </div>

      <div className="flex gap-3 mx-5">
        {
          session ? (
            <div className="flex items-center gap-5">
              <div className="text-xl">
               Hello, {session.user?.name}
              </div>
              <Link href="/api/auth/signout">
                <div className="flex items-center py-2 px-4 rounded-md text-[#E6DDC4] cursor-pointer bg-[#59200D] hover:bg-[#471807]">
                  Sign-Out
                </div>
              </Link>
            </div>
          ) : (


            <div className="flex items-center gap-3">
              <Link href="/auth/signup">
                <div className="flex items-center inset-ring-2 py-2 px-4 rounded-md text-[#59200D] cursor-pointer hover:bg-[#C7BEA1]">
                  Sign-Up
                </div>
              </Link>
              <Link href="/auth/signin">
                <div className="flex items-center py-2 px-4 rounded-md text-[#E6DDC4] cursor-pointer bg-[#59200D] hover:bg-[#471807]">
                  Sign-in
                </div>
              </Link>
            </div>

            // <Link href="/api/auth/signin">
            //   <div className="flex items-center cursor-pointer">
            //     Sign-in
            //   </div>
            // </Link>


          )
        }
      </div>
    </main>
  );
}