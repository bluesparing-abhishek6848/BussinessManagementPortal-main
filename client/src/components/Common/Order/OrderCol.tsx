import type { MRT_ColumnDef } from "material-react-table";
import { DAYJS_DISPLAY_FORMAT_TABLES } from "../../../Constant";
import dayjs from "dayjs";
import type { IOrder } from "./OrderTypes";

export const OrderColumns = (): MRT_ColumnDef<IOrder>[] => [
  { accessorKey: "itemName", header: "Item Name" },
  { accessorKey: "itemDescription", header: "Description" },
  { accessorKey: "quantity", header: "Quantity" },
  { accessorKey: "amountRecieved", header: "Amount Received" },
  { accessorKey: "expenseCost", header: "Expense Cost" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "createdAt",
    header: "Created On",
    size: 100,
    Cell: ({ row }: { row: { original: IOrder } }) => {
      return dayjs(row.original.createdAt).format(DAYJS_DISPLAY_FORMAT_TABLES);
    },
  },
];