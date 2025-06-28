export interface IUsers {
  _id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  dateOfJoining: string;
  isActive: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
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


export interface UserTableProps{
  userRole?:string;
}

export interface IUserDropDown{
  _id:string;
  name:string;
}