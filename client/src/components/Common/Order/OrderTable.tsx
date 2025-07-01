import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../lib/ReusableTable";
import useDelete from "../../../Hooks/useDelete";
import { useMemo } from "react";
import { OrderColumns } from "./OrderCol";
import type { IOrder } from "./OrderTypes";
import { toast } from "react-toastify";

const OrderTable = () => {
  const navigate = useNavigate();

  const { deleteData } = useDelete("orders");
  const userJson = localStorage.getItem("user");
  const role = userJson ? JSON.parse(userJson).role : null;

  // Columns for orders
  const columns = useMemo(() => OrderColumns(), []);

  const handleAdd = () => {
    if (role === "admin") {
      navigate("/admin/orders/add");
    }  else {
      alert("Unauthorized role");
    }
  };

  const handleDelete = async (row: IOrder, refetch: () => void) => {
    try {
      await deleteData(row._id);
      refetch();
      toast.success("Order deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleEdit = (row: IOrder) => {
    if (role === "admin") {
      navigate(`/admin/order/edit/${row._id}`, { state: row });
    } else if (role === "accountManager") {
      navigate(`/account-manager/order/edit/${row._id}`, { state: row });
    } else {
      alert("Unauthorized role");
    }
  };

  return (
    <ReusableTable<IOrder>
      subtitle="Dashboard"
      headLine="Order Table"
      btnText="Add Order"
      endpoint="orders"
      searchEndpoint="orders/search"
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default OrderTable;