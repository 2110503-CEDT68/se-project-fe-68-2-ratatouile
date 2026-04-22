export interface RestaurantItem {
  _id: string;
  id?: string;
  owner?: UserItem;
  name: string;
  address: string;
  telephone: string;
  openTime: string;
  closeTime: string;
  picture?: string;
  createdAt: string;

  menus?: string[] | MenuItem[];
  reservations?: ReservationItem[];
  reviews?: ReviewItem[];
}

export interface RestaurantJson {
  success: boolean;
  count: number;
  pagination?: object;
  data: RestaurantItem[];
}

export interface DishItem {
  _id?: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  picture?: string;
}

export interface MenuItem {
  _id: string;
  id?: string;
  restaurant: RestaurantItem;
  title: string;
  description?: string;
  items: DishItem[]; 
  createdAt: string;
}

export interface MenuJson {
  success: boolean;
  count: number;
  data: MenuItem[];
}

export interface ReservationItem {
  _id: string;
  id?: string;
  reservationDate: string;
  status: 'waiting' | 'approved' | 'rejected';
  reason_reject?: string;
  user: UserItem;
  restaurant: RestaurantItem;
  createdAt: string;
  __v?: number;
}

export interface ReservationJson {
  success: boolean;
  count: number;
  data: ReservationItem[];
}

export interface ReviewItem {
  _id: string;
  id?: string;
  rating: number;
  comment: string;
  user: UserItem;
  restaurant: RestaurantItem;
  createdAt: string;
}

export interface UserItem {
  _id: string;
  id?: string;
  name: string;
  email: string;
  telephone: string;
  role: 'user' | 'admin';
  createdAt: string;
}