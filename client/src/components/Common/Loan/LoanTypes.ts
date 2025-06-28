import type { IUser } from "../../../types";
import type { ICustomer } from "../Customer/CustomerTypes";

export interface ILoan {
  _id: string;
  customer: string|ICustomer;
  collecting_person: IUser;
  amount: number;
  interestRate: number;
  tenure: number;
  emiPerDay: number;
  paidEmi?: number;
  status: "open" | "closed";
  guarantorName: string;
  guarantorPhone: number;
  startDate: string;
  endDate: string;
  docs?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILoanDropDown {
  _id: string;
  emiPerDay: number;
  tenure: number;
  paidEmi: number;

}