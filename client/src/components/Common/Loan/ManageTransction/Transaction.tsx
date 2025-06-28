import { useParams } from "react-router-dom";
import useGet from "../../../../Hooks/useGet";
import Loading from "../../Loading/Loading";
import { TColumns, type ITranctionRes } from "./TransctionCol";
import { useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

// import IconActionButton from "../../../ui/IconActionBtn";
// import usePut from "../../../../Hooks/usePut";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../../store";
// import usePost from "../../../../Hooks/usePost";

const Transaction = () => {
    const { id } = useParams<{ id: string }>();
    const { data: TransactionRes, isLoading } = useGet<ITranctionRes>(`loans/emi-transaction/${id}`);
    const columns = useMemo(() => TColumns, []);
    // const { putData } = usePut();
    // const {postData} = usePost();
    // const { user } = useSelector((state: RootState) => state.auth);
   
    // const runFetch = async () => {
    //     const controller = new AbortController();
    //     try {
    //         await fetchData(
    //             controller.signal,
    //             `loans/emi-transaction/${id}`
    //         );
    //     } catch (error: any) {
    //         if (error.name !== "AbortError") {
    //             console.error("Fetch failed:", error);
    //         }
    //     }
    // };



    // const handleChangeStatus = async(row: ITranction) => {
    //     const status = row.status.toLowerCase().trim();
    //     if(status==="paid"){
    //         const url = `collection/mark-unpaid/${row._id}` ;
    //         const viewRes = await putData({}, url);
    //         if (viewRes.success) {
    //             await runFetch()
    //         }
    //     }else{
    //         const url = `collection/paid`;
    //         const payload = {
    //             paymentId:row._id,
    //             loanId:id,
    //             status:row.status
    //         }

    //         const viewRes = await postData(payload,url) as any;
    //         if (viewRes?.success) {
    //             await runFetch()
    //         }

    //     }
    

      
    // }
    const table = useMaterialReactTable({
        columns,
        data: TransactionRes?.data || [],
        // enableRowActions:user?.role!=="admin"  ,
        positionActionsColumn: "last",
        // renderRowActions: ({ row }) => (
        //     <>
        //         {
        //             (row.original.emiCount <= 1) && <div style={{ display: "flex", gap: "8px" }}>

        //                 <IconActionButton
        //                     title={row.original.status.toLowerCase() === "paid" ? "Unpaid" : "Paid"}
        //                     icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        //                         <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        //                     </svg>
        //                     }
        //                     onClick={() => handleChangeStatus(row.original)}
        //                 />

        //             </div>
        //         }
        //     </>

        // ),
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiTableBodyCellProps: {
            sx: {
                padding: "16px",
                whiteSpace: "nowrap",
            },
        },
        muiTopToolbarProps: {
            sx: {
                padding: "16px 0",
                borderBottom: "1px solid #e0e0e0",
            },
        },
        state: {
            isLoading,
        },
    });

    if (isLoading) {
        return <Loading />
    }
    return (
        <div>
            <MaterialReactTable table={table} />
        </div>
    )
}

export default Transaction
