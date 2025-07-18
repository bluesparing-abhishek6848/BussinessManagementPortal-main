// import type { IBranch } from "./components/Common/Order/OrderTypes";

export interface IUser {
  _id: string;
  profilePic: string;
  name: string;
  phone: number;
  branch: any | string;
  email: string;
  password: string;
  role: "admin" | "branch-manager" | "user" | string;
  createdBy: IUser | string | null;
  updatedBy: IUser | string | null;
  createdAt: string;
  updatedAt: string;
}
