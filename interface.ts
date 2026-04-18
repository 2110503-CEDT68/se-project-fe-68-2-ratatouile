export interface RestaurantItem {
  id: string;
  _id: string;
  name: string;
  address: string;
  telephone: string;
  openTime: string;
  closeTime: string;
  createdAt: string;
  picture: string;
  
  reservations?: ReservationItem[];
  reviews?: ReviewItem[];
}

export interface RestaurantJson {
  success: boolean;
  count: number;
  pagination: object;
  data: RestaurantItem[];
}

export interface ReservationJson {
  success: boolean;
  count: number;
  data: ReservationItem[];
}

export interface ReservationItem {
  _id: string;
  reservationDate: string;
  user: UserItem;
  restaurant: RestaurantItem;
  createdAt: string;
  __v: number;
}

export interface ReviewItem {
  _id: string;
  id: string;
  rating: number;
  comment: string;
  user: string | UserItem;
  restaurant: string;
  createdAt: string;
}

export interface UserItem {
  _id: string;
  id: string;
  name: string;
  email: string;
  telephone: string;
  role: 'user' | 'admin';
  createdAt: string;
}