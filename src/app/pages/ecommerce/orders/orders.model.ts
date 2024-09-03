export interface OrdersModel {
  id: string;
  name: string;
  product: string;
  date: string;
  time: string;
  amount: string;
  pmethod: string;
  status: string;
  isSelected?:any;
}
