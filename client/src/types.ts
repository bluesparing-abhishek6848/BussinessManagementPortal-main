import type { IBranch } from "./components/Common/Branch/OrderTypes";

export interface IUser {
  _id: string;
  profilePic: string;
  name: string;
  phone: number;
  branch: IBranch | string;
  email: string;
  password: string;
  role: "admin" | "branch-manager" | "user" | string;
  createdBy: IUser | string | null;
  updatedBy: IUser | string | null;
  createdAt: string;
  updatedAt: string;
}
