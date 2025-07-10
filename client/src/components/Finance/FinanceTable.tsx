import { useNavigate } from "react-router-dom";
// import useDelete from "../../../Hooks/useDelete";
import useDelete from "../../Hooks/useDelete";
// import ReusableTable from "../../../lib/ReusableTable";
import ReusableTable from "../../lib/ReusableTable";
// import type { FinanceData } from "../AdminDashboard"; // Or define your own type

// Define columns for the finance table
export const FinanceColumns = [
  {
    accessorKey: "type",
    header: "Type",
    size: 100,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 100,
    Cell: ({ row }: { row: { original: any } }) => `₹${row.original.amount}`,
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 120,
    Cell: ({ row }: { row: { original: any } }) =>
      row.original.date
        ? new Date(row.original.date).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 200,
  },
];

const FinanceTable = () => {
  const navigate = useNavigate();
  const { deleteData } = useDelete("finance");

  const handleAdd = () => {
    navigate("add");
  };

  const handleEdit = (row: any) => {
    navigate(`edit`, { state: row });
  };

  const handleDelete = async (row: any, refetch: () => void) => {
    try {
      await deleteData(row._id);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      refetch();
    } catch (error: any) {
      // Handle error (toast, etc.)
      console.error("Error deleting finance record:", error);
    }
  };

  return (
    <ReusableTable<any>
      subtitle="Dashboard"
      headLine="Finance Table"
      btnText="Add Finance"
      endpoint={`finance`}
      searchEndpoint={`finance/search`}
      columns={FinanceColumns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default FinanceTable;