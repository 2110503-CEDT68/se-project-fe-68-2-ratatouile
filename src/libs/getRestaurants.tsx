export default async function getRestaurants() {
    const response = await fetch("https://be-project-68-dinoping-host.vercel.app/api/v1/restaurants")

    if(!response.ok) {
        throw new Error("Failed to fetch restaurant")
    }
    
    return await response.json();
}