import { useNavigate } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";

import useDelete from "../../../Hooks/useDelete";

import ReusableTable from "../../../lib/ReusableTable";
import { CapitalColumns } from "./CapitalCol";
import type { ICapital } from "./CapitalTypes";
import type { GetResData } from "../../Common/Customer/CustomerTypes";
import useGet from "../../../Hooks/useGet";
import type { IBranchDropDown } from "../../Common/Branch/BranchTypes";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';

import { toast } from "react-toastify";
import DropDownSkeleton from "../../SkeletonPage/DropDownSkeleton";
import TableSkeleton from "../../SkeletonPage/TableSkeleton";

const CapitalTable = () => {
  const navigate = useNavigate();
  const { deleteData } = useDelete("finance");
  const { data: branchList } =
    useGet<GetResData<IBranchDropDown>>("branches/drop-down");


  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const columns = useMemo(() => CapitalColumns, [selectedBranch]);

  useEffect(() => {
    if (branchList?.data?.length && !selectedBranch) {
      setSelectedBranch(branchList.data[0]._id);
    }
  }, [branchList]);


  const handleAdd = () => {
    navigate("add");
  };

  const handleEdit = (row: ICapital) => {
    navigate(`edit`,{ state: row });
  };

  const handleDelete = async (row: ICapital, refetch: () => void) => {
    try {
      await deleteData(row._id);
      refetch();
      toast.success("Capital deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const handleBranchChange = (event: SelectChangeEvent<string>) => {
    setSelectedBranch(event.target.value);
  };

  return (
    <>
      {!branchList?.data ? (
        <DropDownSkeleton height={56} width="100%" />

      ) : (
        <FormControl fullWidth>
          <InputLabel id="branch-select-label">Select Branch</InputLabel>
          <Select
            labelId="branch-select-label"
            id="branch-select"
            value={selectedBranch}
            label="Select Branch"
            onChange={handleBranchChange}
          >
            {branchList.data.map((branch) => (
              <MenuItem key={branch._id} value={branch._id}>
                {branch.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}


      {!branchList?.data || !selectedBranch ? (
        <TableSkeleton />
      ) : (
        <ReusableTable<ICapital>
          key={selectedBranch}
          subtitle="Dashboard"
          headLine="Capital Payment Table"
          btnText="Add Finance"
          endpoint={`finance?branch=${selectedBranch}`}
          searchEndpoint={`finance/search?branch=${selectedBranch}`}
          columns={columns}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

    </>
  );
};

export default CapitalTable;
