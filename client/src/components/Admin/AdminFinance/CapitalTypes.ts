export interface ICapital {
  branch:string;
  amount:number;
  createdBy: string | null;
  updatedBy: string | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  status: "success" | "fail" | "error";
  total: number;
  page: number;
  totalPages: number;
  count: number;
  data: T[];
}
