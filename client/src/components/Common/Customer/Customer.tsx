import { useNavigate, useLocation } from "react-router-dom";

import { useMemo } from "react";

import { CustomerColumns } from "./CustomerCol";
import useDelete from "../../../Hooks/useDelete";
import type { ICustomer } from "./CustomerTypes";
import ReusableTable from "../../../lib/ReusableTable";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store";

const Customer = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const stateBranchId = location.state?.branchId;

  const {  user } = useSelector((state: RootState) => state.auth);
const location = useLocation();
const stateBranchId = location.state?.branchId;

const userBranch = user?.branch;
const userBranchId =
  typeof userBranch === "object" && userBranch !== null && "_id" in userBranch
    ? userBranch._id
    : typeof userBranch === "string"
    ? userBranch
    : undefined;

const branchId =  userBranchId || stateBranchId;
  const { deleteData } = useDelete("customers");

  const columns = useMemo(() => CustomerColumns, []);

  const handleAdd = () => {
    navigate("add");
  };

  const handleEdit = (row: ICustomer) => {
    navigate("edit", { state: row });
  };

  const handleView = (row: ICustomer) => {
    navigate("view", { state: row });
  };

  const handleDelete = async (row: ICustomer, refetch: () => void) => {
    try {
      await deleteData(row._id);
      refetch();
      toast.success("Customer deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <ReusableTable<ICustomer>
      subtitle="Dashboard"
      headLine="Customer Table"
      btnText="Add Customer"
      endpoint={branchId ? `customers?branch=${branchId}` : "customers"}
      searchEndpoint={
        branchId ? `customers/search?branch=${branchId}` : "customers/search"
      }
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
    />
  );
};

export default Customer;
