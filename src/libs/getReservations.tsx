import { apiUrl } from "./apiUrl";

export default async function getReservations() {
  const response = await fetch(apiUrl("/api/v1/reservations"));

  if (!response.ok) {
    throw new Error("Failed to fetch reservations");
  }

  return await response.json();
}
