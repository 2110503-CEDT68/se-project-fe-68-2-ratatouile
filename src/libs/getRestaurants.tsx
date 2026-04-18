import { apiUrl } from "./apiUrl";

export default async function getRestaurants() {
  const response = await fetch(apiUrl("/api/v1/restaurants"));

  if (!response.ok) {
    throw new Error("Failed to fetch restaurant");
  }

  return await response.json();
}
