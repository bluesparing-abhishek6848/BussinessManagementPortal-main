import dayjs from "dayjs";
import { DAYJS_DISPLAY_FORMAT_TABLES } from "../../../Constant";

export const CapitalColumns = [
  {
    accessorKey: "amount",
    header: " Amount",
    size: 100,
    Cell: ({ row }: { row: { original: any } }) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(row.original.amount);
    },
  },

// { accessorKey: "branch.name", header: "Branch" },
  {
    accessorKey: "createdAt",
    header: "Created On",
    size: 100,
    Cell: ({ row }: { row: { original: any } }) => {
      return dayjs(row.original.createdAt).format(DAYJS_DISPLAY_FORMAT_TABLES);
    },
  },
];
