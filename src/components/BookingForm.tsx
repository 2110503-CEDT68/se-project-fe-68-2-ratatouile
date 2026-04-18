// "use client"
// import React, { useState } from "react";
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import { FormControl, InputLabel, MenuItem, TextField, Box } from "@mui/material";
// import DatePickers from "@/components/DateReserve";
// import { useSearchParams } from "next/navigation";

// import dayjs,{ Dayjs } from "dayjs";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import { RestaurantItem } from "../../interface";
// import { addBooking } from "@/redux/features/bookSlice";
// import { ReservationItem } from "../../interface"

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// export default async function BookingForm() {

//     const session = await getServerSession(authOptions);

//     const [restaurant, setRestaurant] = React.useState('');
//     const [nameLastname, setNameLastname] = React.useState('');
//     const [tel, setTel] = React.useState('');
//     const [bookDate, setBookDate] = React.useState<Dayjs|null>(null);

//     const handleChange = (event: SelectChangeEvent) => {
//         setRestaurant(event.target.value);
//     };

//     const dispatch = useDispatch<AppDispatch>()

//     // const urlParams = useSearchParams();
//     // const vid = urlParams.get('id');
//     // const venueName = urlParams.get('venue');

//     const makeBooking = () => {
//         console.log(restaurant)
//         console.log(nameLastname)
//         console.log(tel)
//         console.log(bookDate)

//         // if(restaurant && nameLastname && tel && bookDate) {
//         //     const item:ReservationItem = {
//         //         userId: nameLastname,
//         //         restaurant: restaurant,
//         //         reservationDate: dayjs(bookDate).format("YYYY/MM/DD")
//         //     }
//         //     console.log("DISPATCH", item);
//         //     dispatch(addBooking(item))
//         // }
//     }

//     return (
//             <div className="bg-white/10 rounded-lg shadow-lg p-10 my-20 mx-auto w-[800px] border-1">

//                 <h1 className="text-center font-bold text-2xl pb-5">Venue Booking</h1>

//                 {/* <h1 className="text-center text-lg pb-10">{venueName}</h1> */}

//                 <Box component="form"
//                     onSubmit={(e) => {
//                         makeBooking();
//                     }}
//                     sx={{ display: "flex", justifyContent:"center", flexDirection: "column", gap: 5 }}
//                     >

//                     <TextField onChange={(e) => setNameLastname(e.target.value)}  variant="standard" label="Name-Lastname" name="Name-Lastname" size="small"/>

//                     <TextField onChange={(e) => setTel(e.target.value)}  variant="standard" label="Contact-Number" name="Contact-Number" size="small"/>

//                     <FormControl fullWidth size="small">
//                         <InputLabel id="venue-select-label">Venue</InputLabel>
//                         <Select
//                             labelId="venue-select-label"
//                             id="venue"
//                             value={restaurant}
//                             label="Venue"
//                             variant="standard"
//                             onChange={handleChange}
//                         >
//                             <MenuItem value="Bloom">The Bloom Pavilion</MenuItem>
//                             <MenuItem value="Spark">Spark Space</MenuItem>
//                             <MenuItem value="GrandTable">The Grand Table</MenuItem>
//                         </Select>
//                     </FormControl>

//                     <DatePickers onDateChange={(value:Dayjs)=>{setBookDate(value)}}/>

//                     <button
//                         type="submit"
//                         className="bg-[#d7b879] hover:bg-[#c6a769] py-2 rounded-lg text-white cursor-pointer"
//                         value="Book Venue"
//                         name="Book Venue"
//                     >
//                         Book Venue
//                     </button>
//                 </Box>
//             </div>
//     );
// }

"use client";
import React, { useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FormControl, MenuItem, Box } from "@mui/material";
import DatePickers from "@/components/DateReserve";
import dayjs, { Dayjs } from "dayjs";
import { useSession } from "next-auth/react";
import { RestaurantItem } from "../../interface";
import getRestaurants from "@/libs/getRestaurants";
import TimePickers from "@/components/TimeReserve";
import { useSearchParams } from "next/navigation";
import { apiUrl } from "@/libs/apiUrl";

export default function BookingForm() {
  const { data: session } = useSession();

  const urlParams = useSearchParams();

  const rid = urlParams.get("id");
  const restaurantName = urlParams.get("restaurant");
  const isUpdate = urlParams.get("update");

  const reservationId = urlParams.get("reservationId");

  const [restaurantId, setRestaurantId] = useState(rid || "");

  const [bookDate, setBookDate] = useState<Dayjs | null>(null);
  const [bookTime, setBookTime] = useState<Dayjs | null>(null);

  const [loading, setLoading] = useState(true);

  const handleChange = (event: SelectChangeEvent) => {
    setRestaurantId(event.target.value);
  };

  const makeBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!restaurantId) {
      alert("Please select restaurant for your reservation.");
      return;
    }

    if (!bookDate || !bookTime) {
      alert("Please select both date and time for your reservation.");
      return;
    }

    const dateString = bookDate.format("YYYY-MM-DD");
    const timeString = bookTime.format("HH:mm");

    const combinedDateTime = `${dateString}T${timeString}:00.000Z`;

    if (isUpdate) {
      try {
        const response = await fetch(
          apiUrl(`/api/v1/reservations/${reservationId}`),
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.token}`,
            },
            body: JSON.stringify({
              restaurant: restaurantId,
              reservationDate: combinedDateTime,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update a reservation");
        }

        console.log("Success:", data);

        const selectedRestaurant = restaurants.find(
          (r: any) => r._id === restaurantId
        );

        const restaurantName = selectedRestaurant?.name || "Restaurant";

        alert(
          "Update Successful!\n" +
            "--------------------------\n" +
            `Location: ${restaurantName}\n` +
            `Date: ${dateString}\n` +
            `Time: ${timeString}\n` +
            "--------------------------\n" +
            "We look forward to seeing you!"
        );
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      try {
        const response = await fetch(
          apiUrl(`/api/v1/restaurants/${restaurantId}/reservations`),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user.token}`,
            },
            body: JSON.stringify({
              reservationDate: combinedDateTime,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert("You has already made 3 reservations");
          return;
        }

        console.log("Success:", data);

        const selectedRestaurant = restaurants.find(
          (r: any) => r._id === restaurantId
        );

        const restaurantName = selectedRestaurant?.name || "Restaurant";

        alert(
          "Booking Successful!\n" +
            "--------------------------\n" +
            `Location: ${restaurantName}\n` +
            `Date: ${dateString}\n` +
            `Time: ${timeString}\n` +
            "--------------------------\n" +
            "We look forward to seeing you!"
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const json = await getRestaurants();
        const data: RestaurantItem[] = json.data;
        setRestaurants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <p className="text-center text-white/70 text-lg mt-30 z-10 backdrop-blur">
          Loading...
        </p>
      ) : (
        <div className="bg-[#D9C89C]/70 backdrop-blur-xl rounded-[2rem] p-12 my-30 mx-auto w-[900px] border-2 border-[#D9C89C] inset-shadow-[0_5px_30px_rgba(0,0,0,0.25)]">
          <Box
            component="form"
            onSubmit={makeBooking}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            className="border p-10 bg-white rounded-[1.5rem] items-center opacity-80 shadow-[0_5px_10px_rgba(0,0,0,0.25)]"
          >
            <h1 className="text-center font-serif text-[#3D220F] text-3xl tracking-[0.2em] pb-2 uppercase">
              Reserve Your Table
            </h1>

            <div className="w-80">
              <div className="text-[#3D220F] text-left mb-1">Location</div>
              <FormControl fullWidth variant="standard">
                <Select
                  disableUnderline
                  labelId="restaurant-select-label"
                  id="restaurant"
                  value={restaurantId}
                  className="border-2 border-[#3D220F] p-2 rounded-[16px] bg-[#D9C89C]/30"
                  label="Restaurant"
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return restaurantName || "Select restaurant";
                    }
                    const selectedRestaurant = restaurants.find(
                      (r) => r._id === selected
                    );
                    return selectedRestaurant?.name || "";
                  }}
                  onChange={handleChange}
                  sx={{
                    color: "#6e6666",
                    ".MuiSvgIcon-root": { color: "#3D220F" },
                  }}
                >
                  {restaurants.map((restaurant) => (
                    <MenuItem value={restaurant._id}>
                      {restaurant.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="rounded-lg w-80">
              <DatePickers
                onDateChange={(value: Dayjs) => {
                  setBookDate(value);
                }}
              />
            </div>

            <div className="rounded-lg w-80">
              <TimePickers
                onTimeChange={(value: Dayjs) => {
                  setBookTime(value);
                }}
              />
            </div>

            <button
              type="submit"
              onClick={makeBooking}
              className="cursor-pointer inset-shadow-sm inset-shadow-[#3C3411] bg-[#73683B] text-[#D9C89C] translate-y-17 w-70 hover:bg-[#665A2C] py-4 rounded-full text-md tracking-[0.3em] transition-all shadow-lg"
            >
              Book
            </button>
          </Box>
        </div>
      )}
    </div>
  );
}
