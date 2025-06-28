import dayjs from "dayjs";
import { DAYJS_DISPLAY_FORMAT_TABLES } from "../../../Constant";
export const LoanColumns = [
    {
    accessorKey: "startDate",
    header: "Start Date",
    size: 100,
    Cell: ({ row }: { row: { original: any } }) => {
      return dayjs(row.original.startDate).format(DAYJS_DISPLAY_FORMAT_TABLES);
    },
  },
  {
    accessorKey: "branch.name",
    header: "Branch",
    size: 100,
  },
  {
    accessorKey: "customer.name",
    header: "Customer Name",
    size: 100,
  },
  {
    accessorKey: "customer.customerId",
    header: "Customer Id",
    size: 100,
  },
  {
    accessorKey: "customer.phone",
    header: "Customer Phone",
    size: 100,
  },
  {
    accessorKey: "customer.aadhar",
    header: "Customer Aadhar",
    size: 100,
  },
   
  {
    accessorKey: "tenure",
    header: "Total EMI",
    size: 100,
  },
  {
    accessorKey: "paidEmi",
    header: "Paid EMI",
    size: 100,
  },
  {
    accessorKey: "amount",
    header: "Principal Amount",
    size: 100,
  },

    {
    accessorKey: "emiPerDay",
    header: "Emi Per Day",
    size: 100,
  },
  {
    accessorKey: "collecting_person.name",
    header: "Collection Manager",
    size: 100,
  },
  
  
  
  
  

  
  
  
  
  

 
  
  

  {
    accessorKey: "endDate",
    header: "End Date",
    size: 100,
    Cell: ({ row }: { row: { original: any } }) => {
      return dayjs(row.original.endDate).format(DAYJS_DISPLAY_FORMAT_TABLES);
    },
  },
   {
    accessorKey: "status",
    header: "Status",
    size: 100,
  },
  
  
  
  
  
  
  
  
];
