import dayjs from "dayjs";
import { DAYJS_DISPLAY_FORMAT_TABLES } from "../../../Constant";

export const CustomerColumns = [
    {
        accessorKey: "name",
        header: "Customer Name",
        size: 100,
    },
    {
        accessorKey: "customerId",
        header: "Customer Id",
        size: 100,
    },
    {
        accessorKey: "address",
        header: "Address",
        size: 100,
    },
    {
        accessorKey: "phone",
        header: "Phone No",
        size: 100,
    },
    {
        accessorKey: "alternative_phone",
        header: "Alternative Phone",
        size: 100,
    },
    {
        accessorKey: "aadhar",
        header: "adhara No",
        size: 100,
    },
    {
        accessorKey: "createdAt",
        header: "Created On",
        size: 100,
        Cell: ({ row }: { row: { original: any } }) => {
            return dayjs(row.original.createdAt).format(DAYJS_DISPLAY_FORMAT_TABLES);
        },
    },
];