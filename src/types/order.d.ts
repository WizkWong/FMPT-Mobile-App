import { Status } from "./enum";
import { Product } from "./productPart";

export interface Order {
  id?: number;
  description?: string;
  product?: Product;
  quantity?: number;
  status?: Status;
  deadlineDateTime?: string;
  createdDateTime?: string;
}

export interface OrderPage {
  orderList: Order[];
  hasNext: boolean;
}