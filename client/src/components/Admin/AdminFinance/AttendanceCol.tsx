import dayjs from "dayjs";
import { DAYJS_DISPLAY_FORMAT_TABLES } from "../../../Constant";

export const AttendanceColumns = [
  {
    accessorKey: "employeeId.name",
    header: "Employee",
    size: 150,
    Cell: ({ row }: { row: { original: any } }) => row.original.employeeId?.name || "-",
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 120,
    Cell: ({ row }: { row: { original: any } }) =>
      row.original.date ? dayjs(row.original.date).format("DD/MM/YYYY") : "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    Cell: ({ row }: { row: { original: any } }) => row.original.status || "-",
  },
  {
    accessorKey: "checkInTime",
    header: "Check In",
    size: 100,
    Cell: ({ row }: { row: { original: any } }) =>
      row.original.checkInTime
        ? dayjs(row.original.checkInTime).format("HH:mm")
        : "-",
  },
  {
    accessorKey: "checkOutTime",
    header: "Check Out",
    size: 100,
    Cell: ({ row }: { row: { original: any } }) =>
      row.original.checkOutTime
        ? dayjs(row.original.checkOutTime).format("HH:mm")
        : "-",
  },
  {
    accessorKey: "createdBy.name",
    header: "Created By",
    size: 120,
    Cell: ({ row }: { row: { original: any } }) => row.original.createdBy?.name || "-",
  },
  {
    accessorKey: "createdAt",
    header: "Created On",
    size: 120,
    Cell: ({ row }: { row: { original: any } }) =>
      dayjs(row.original.createdAt).format(DAYJS_DISPLAY_FORMAT_TABLES),
  },
];