export interface IBranch {

  _id: string;
  name: string;
  address?: string;
  manager?: string;

  createdBy: string | null;
  updatedBy: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface IBranchDropDown {
  _id: string;
  name: string;
}