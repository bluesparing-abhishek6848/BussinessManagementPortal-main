import type { IUsers } from "./UserTypes";
import { DAYJS_DISPLAY_FORMAT_TABLES } from "../../../Constant";
import dayjs from "dayjs";
import { Chip } from "@material-ui/core";
// import React from "react";

export const UserColumns = [
  { accessorKey: "name", header: "Name" },
  // { accessorKey: "email", header: "Email" },
  { accessorKey: "position", header: "Position" },
  { accessorKey: "department", header: "Department" },
  { accessorKey: "salary", header: "Salary" },
  {
    accessorKey: "dateOfJoining",
    header: "Date of Joining",
    Cell: ({ row }: { row: { original: IUsers } }) =>
      dayjs(row.original.dateOfJoining).format(DAYJS_DISPLAY_FORMAT_TABLES),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    Cell: ({ row }: { row: { original: IUsers } }) => (
      <Chip
        label={row.original.isActive ? "Active" : "Inactive"}
        style={{
          background: row.original.isActive ? "#4caf50" : "#f44336",
          color: "#fff",
        }}
        size="small"
      />
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    Cell: ({ row }: { row: { original: IUsers } }) => {
      const { street, city, state, zipCode } = row.original.address || {};
      return [street, city, state, zipCode].filter(Boolean).join(", ");
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created On",
    size: 100,
    Cell: ({ row }: { row: { original: IUsers } }) =>
      dayjs(row.original.createdAt).format(DAYJS_DISPLAY_FORMAT_TABLES),
  },
];