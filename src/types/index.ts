// ============================================================
// Auth / Users
// ============================================================

export interface User {
  id: string;
  email: string;
  username: string;
  role_id: number; // 1=customer, 2=admin
}

export interface UserToken {
  id: string;
  access_token: string;
  refresh_token: string;
}

export interface UserPassport {
  user: User;
  token: UserToken;
}

// ============================================================
// AppInfo / Categories
// ============================================================

export interface Category {
  id: number;
  title: string;
}

// ============================================================
// Products
// ============================================================

export interface ProductImage {
  id: string;
  filename: string;
  url: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface CreateProductPayload {
  title: string;
  description: string;
  price: number;
  category: { id: number };
  images: { filename: string; url: string }[];
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ============================================================
// Orders
// ============================================================

export type OrderStatus = "waiting" | "shipping" | "completed" | "canceled";

export interface TransferSlip {
  id: string;
  filename: string;
  url: string;
  created_at: string;
}

export interface ProductsOrder {
  id: string;
  qty: number;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  address: string;
  contact: string;
  status: OrderStatus;
  total_paid: number;
  products: ProductsOrder[];
  transfer_slip: TransferSlip | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  address: string;
  contact: string;
  products: { id: string; qty: number }[];
}

export interface UpdateOrderPayload {
  status?: OrderStatus;
  transfer_slip?: { filename: string; url: string };
}

// ============================================================
// Shared / Pagination
// ============================================================

export interface PaginationReq {
  page: number;
  limit: number;
  total_page: number;
  total_item: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationReq;
}

// ============================================================
// Query Params
// ============================================================

export interface ProductsQuery {
  id?: string;
  search?: string;
  page?: number;
  limit?: number;
  order_by?: "id" | "created_at";
  sort?: "ASC" | "DESC";
}

export interface OrdersQuery {
  search?: string;
  status?: OrderStatus;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  order_by?: "id" | "created_at";
  sort?: "ASC" | "DESC";
}

// ============================================================
// Cart
// ============================================================

export interface CartItem {
  product: Product;
  qty: number;
}

// ============================================================
// File Upload
// ============================================================

export interface UploadedFile {
  id: string;
  filename: string;
  url: string;
}
