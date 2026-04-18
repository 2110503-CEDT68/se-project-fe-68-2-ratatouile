import React from "react";
// import getUserProfile from "@/libs/getUserProfile";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import BookingForm from "@/components/BookingForm";
import Image from "next/image";



export default async function Booking() {
    // const session = await getServerSession(authOptions);
    
    // if (!session || !session.user.token) return null;

    // const profile = await getUserProfile(session.user.token);
    // console.log(session);
    
    // var createdAt = new Date(profile.data.createdAt)

    return (
      // 9F9362 504721
      <div className="flex flex-col w-full justify-center">
        <div className="w-full h-full">
          <Image src="/img/2.png" fill alt="bg" className="object-cover brightness-80 blur-xs"/>
          <div className="absolute w-full h-full bg-linear-to-t from-[#504721] to-[#9F9362] opacity-70"></div>
        </div>

        <BookingForm/>

      </div>
    );
}


// export default async function Booking() {

//     const [venue, setVenue] = React.useState('');

//     const handleChange = (event: SelectChangeEvent) => {
//     setVenue(event.target.value);
//     };

//     const session = await getServerSession(authOptions)
//     if(!session || !session.user.token) return null

//     const profile = await getUserProfile(session.user.token)
//     var createAt = new Date(profile.data.createAt)


//   return (
//     <main className="flex flex-col w-full justify-center">

//     <BookingForm/>
      
// {/*       
//       <div className="bg-white/10 rounded-lg shadow-lg p-10 my-20 mx-auto w-[800px] border-1">

//         <h1 className="text-center font-bold text-2xl pb-10">Venue Booking</h1>
//         {profile.name}a

//             <Box component="form" sx={{ display: "flex", justifyContent:"center", flexDirection: "column", gap: 5 }}>

//             <TextField variant="standard" label="Name-Lastname" name="Name-Lastname" size="small"/>

//             <TextField variant="standard" label="Contact-Number" name="Contact-Number" size="small"/>

//             <FormControl fullWidth size="small">
//                 <InputLabel id="demo-simple-select-label">Venue</InputLabel>
//                 <Select
//                     labelId="demo-simple-select-label"
//                     id="venue"
//                     value={venue}
//                     label="Venue"
//                     variant="standard"
//                     onChange={handleChange} >
//                     <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
//                     <MenuItem value="Spark">Spark Space</MenuItem>
//                     <MenuItem value="GrandTable">The Grand Table</MenuItem>
//                 </Select>
//             </FormControl>  

//             <DatePickers/>

//             <button className="bg-[#d7b879] hover:bg-[#c6a769] py-2 rounded-lg text-white cursor-pointer" value="Book Venue" name="Book Venue">
//                 Book Venue
//             </button>
//         </Box>

//       </div> */}
        
//     </main>
//   );
// }