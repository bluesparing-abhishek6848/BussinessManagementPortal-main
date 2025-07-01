export interface IOrder {
  _id: string;
  itemName: string;
  itemImage?: string;
  itemDescription: string;
  quantity: number;
  amountRecieved?: number;
  expenseCost?: number;
  price: number;
  status: "recieved" | "making" | "completed" | "pending";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}


