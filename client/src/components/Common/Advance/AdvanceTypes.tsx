export interface IAdvance {
  _id: string;
  advanceAmount: number;
  employeeId: {
    _id: string;
    name: string;
    email?: string;
    position?: string;
    department?: string;
  };
  status: "pending" | "approved" | "rejected";
  date: string; // <-- Add this line
  createdAt: string;
  updatedAt: string;
}