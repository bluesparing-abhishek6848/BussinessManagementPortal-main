import { Chip } from "@mui/material";
import dayjs from "dayjs";
import type { IAdvance } from "./AdvanceTypes";

export const AdvanceColumns = [
  {
    accessorKey: "employeeId.name",
    header: "Employee Name",
    Cell: ({ row }: { row: { original: IAdvance } }) =>
      row.original.employeeId?.name || "-",
  },
  // {
  //   accessorKey: "employeeId.email",
  //   header: "Email",
  //   Cell: ({ row }: { row: { original: IAdvance } }) =>
  //     row.original.employeeId?.email || "-",
  // },
  {
    accessorKey: "advanceAmount",
    header: "Advance Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
    Cell: ({ row }: { row: { original: IAdvance } }) => (
      <Chip
        label={row.original.status}
        color={
          row.original.status === "approved"
            ? "success"
            : row.original.status === "pending"
            ? "warning"
            : "error"
        }
        size="small"
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Requested On",
    Cell: ({ row }: { row: { original: IAdvance } }) =>
      dayjs(row.original.createdAt).format("DD/MM/YYYY hh:mm A"),
  },
];