export interface IAttendance {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    // Add other employee fields if needed
  };
  date: string;
  status: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdBy: {
    _id: string;
    name: string;
    // Add other user fields if needed
  } | null;
  updatedBy?: {
    _id: string;
    name: string;
  } | null;
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