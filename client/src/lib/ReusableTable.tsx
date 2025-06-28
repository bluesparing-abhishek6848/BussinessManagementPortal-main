import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_RowData,
  type MRT_SortingState,
} from "material-react-table";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

import useGet from "../Hooks/useGet";
import { buildGetFilterEndpoint, buildSearchEndpoint } from "../Constant";
import IconActionButton from "../components/ui/IconActionBtn";
import TableWrapper from "./TableWrapper";
import TableSkeleton from "../components/SkeletonPage/TableSkeleton";

interface ReusableTableProps<T extends MRT_RowData> {
  subtitle?: string;
  headLine: string;
  btnText?: string;
  endpoint: string;
  searchEndpoint?: string;
  columns: MRT_ColumnDef<T>[];
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T, refetch: () => void) => void;
  onView?: (id: T) => void;
  
}

const ReusableTable = <T extends { _id: string }>({
  subtitle,
  headLine,
  btnText,
  endpoint,
  searchEndpoint,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView,
}: ReusableTableProps<T>) => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: ResData, isLoading, fetchData } = useGet<{ data: T[] }>();

  const refetchData = () => {
    let ep = "";
    if (globalFilter && searchEndpoint) {
      ep = buildSearchEndpoint({
        baseUrl: searchEndpoint,
        pagination,
        sorting,
        q: globalFilter,
      });
    } else {
      ep = buildGetFilterEndpoint({
        baseUrl: endpoint,
        pagination,
        sorting,
        columnFilters,
      });
    }
    const controller = new AbortController();
    fetchData(controller.signal, ep);
  };

  useEffect(() => {
    refetchData();
  }, [
    columnFilters,
    globalFilter,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
  ]);

  const table = useMaterialReactTable({
    columns,
    data: ResData?.data || [],
    onPaginationChange: setPagination,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableRowActions: !!onEdit || !!onDelete || !!onView,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    positionActionsColumn: "last",
    // ✅ Custom Styling Props

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
      globalFilter: globalFilter?.trim(),
      pagination,
      columnFilters,
    },
    renderRowActions: ({ row }) => (
      <div style={{ display: "flex", flexWrap: "nowrap" }}>
        {onEdit && (
          <IconActionButton
            title="Edit"
            icon={<EditIcon color="primary" />}
            onClick={() => onEdit?.(row.original)}
          />
        )}
        {onDelete && (
          <IconActionButton
            title="Delete"
            icon={<DeleteIcon color="error" />}
            onClick={() => onDelete(row.original, refetchData)}
          />
        )}
        {onView && (
          <IconActionButton
            title="View"
            icon={<RemoveRedEyeOutlinedIcon color="warning" />}
            onClick={() => onView(row.original)}
          />
        )}
      </div>
    ),
  });
if(isLoading){
  return    <TableSkeleton />
}
  return (
    <TableWrapper
      subtitle={subtitle}
      headLine={headLine}
      onHandleClick={onAdd}
      btnText={btnText}
    >
      <MaterialReactTable table={table} />
    </TableWrapper>
  );
};

export default ReusableTable;
