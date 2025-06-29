import type { MRT_ColumnDef } from "material-react-table";
import { DAYJS_DISPLAY_FORMAT_TABLES } from "../../../Constant";
import dayjs from "dayjs";
import type { IBranch } from "./OrderTypes";

export const BranchColumns = (): MRT_ColumnDef<IBranch>[] => [
  { accessorKey: "name", header: "Branch Name" },
  { accessorKey: "address", header: "Branch Address" },
  {
    accessorKey: "createdAt",
    header: "Created On",
    size: 100,
    Cell: ({ row }: { row: { original: IBranch } }) => {
      return dayjs(row.original.createdAt).format(DAYJS_DISPLAY_FORMAT_TABLES);
    },
  },
];
