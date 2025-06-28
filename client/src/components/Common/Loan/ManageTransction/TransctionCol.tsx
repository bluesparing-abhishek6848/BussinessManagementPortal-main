import dayjs from "dayjs";
import { DAYJS_DISPLAY_FORMAT_TABLES } from "../../../../Constant";



export interface ITranctionRes{
    success:boolean;
    data:ITranction[];
}
export interface ITranction {
    _id:string;
    collectionDate:string;
    status:string;
    emiCount:number;
}
export const TColumns = [
    {
    accessorKey: "collectionDate",
    header: "Collection Date",
    size: 100,
    Cell: ({ row }: { row: { original: any } }) => {
      return dayjs(row.original.collectionDate).format(DAYJS_DISPLAY_FORMAT_TABLES);
    },
  },
   {
    accessorKey: "status",
    header: "Status",
    size: 100,
  },
  {
    accessorKey: "emiCount",
    header: "EMI Paid",
    size: 100,
  },
  
  
];
