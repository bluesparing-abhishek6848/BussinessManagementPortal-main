export interface ICustomer {
    name: string;
    phone: number;
    address: string;
    aadhar: string;
  branch?:string;
    alternative_phone:string;
    createdBy: string | null;
    updatedBy: string | null;
    _id: string;
    createdAt: string;
    updatedAt: string;
    customerId: string;
  }
  

  export interface PaginatedResponse<T> {
    status: "success" | "fail" | "error";
    total: number;
    page: number;
    totalPages: number;
    count: number;
    data: T[];
  }
  export interface FilterTypes {
    [key: string]: string | number;
}

export interface ICustomerDropDown{
  _id:string;
  customerId:string;
  name:string;
}

export interface GetResData<T>{
  statusCode:number;
  data:T[];
  message:string;
  success:boolean;
}

export interface GetResByID<T>{
  statusCode:number;
  data:T;
  message:string;
  success:boolean;
}