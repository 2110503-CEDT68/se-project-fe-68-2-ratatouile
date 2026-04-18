export default async function getReservations() {
    const response = await fetch("https://be-project-68-dinoping-host.vercel.app/api/v1/reservations")

    if(!response.ok) {
        throw new Error("Failed to fetch reservations")
    }
    
    return await response.json();
}