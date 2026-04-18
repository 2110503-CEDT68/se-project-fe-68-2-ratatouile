import { apiUrl } from "./apiUrl";

export default async function getRestaurant(id: string) {
  const response = await fetch(apiUrl(`/api/v1/restaurants/${id}`));

  if (!response.ok) {
    throw new Error("Failed to fetch restaurant id:" + id);
  }

  return await response.json();
}
