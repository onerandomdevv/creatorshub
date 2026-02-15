export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  status: OrderStatus;
  createdAt: string;
}
