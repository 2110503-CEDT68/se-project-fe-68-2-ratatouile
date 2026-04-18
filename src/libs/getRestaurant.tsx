export default async function getRestaurant(id:string) {
    const response = await fetch(`https://be-project-68-dinoping-host.vercel.app/api/v1/restaurant/${id}`)

    if(!response.ok) {
        throw new Error("Failed to fetch restaurant id:" + id)
    }
    
    return await response.json();
}