import { Controller, useForm } from "react-hook-form";
import { Grid } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import usePost from "../../../../Hooks/usePost";
import InputField from "../../../../lib/InputField";
import useGet from "../../../../Hooks/useGet";
import { toast } from "react-toastify";
// import FormHelperText from "@material-ui/core";
import { ReusableAutocomplete } from "../../../../lib/ReusableAutocomplete";
// import type { IBranchDropDown } from "../../../Common/Branch/OrderTypes";

// import type { RootState } from "../../../../store";
// import { useSelector } from "react-redux";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import MenuItem from "@mui/material/MenuItem";
// import { useState } from "react";
import dayjs from "dayjs";

interface AddAttendanceFormProps {
  employeeId: any;
  date: string | Date | null;
  status: string;
  checkInTime?: string | Date | null;
  checkOutTime?: string | Date | null;
  // branch: IBranchDropDown;
}

const statusOptions = [
  { value: "Present", label: "Present" },
  { value: "Absent", label: "Absent" },
  { value: "Leave", label: "Leave" },
];

const AddAttendanceForm = () => {
  const navigate = useNavigate();
  const { data: userList } = useGet<{ data: any }>("employees");

  // const { data: branchData } = useGet<GetResData<IBranchDropDown>>("branches/drop-down");

  // const { user } = useSelector((state: RootState) => state.auth);
  const { postData, isLoading } = usePost<any, AddAttendanceFormProps>();
  const {
    control,
    handleSubmit,
    // register,
    reset,
    formState: { errors },
  } = useForm<AddAttendanceFormProps>({
    defaultValues: {
      date: dayjs().toDate(),
      status: "Present",
    },
  });

  // const [selectedBranch, setSelectedBranch] = useState<IBranchDropDown | null>(null);

  const onSubmit = async (data: AddAttendanceFormProps) => {
    try {
      const payload = {
        ...data,
        date: dayjs(data.date).toISOString(),
        checkInTime: data.checkInTime ? dayjs(data.checkInTime).toISOString() : undefined,
        checkOutTime: data.checkOutTime ? dayjs(data.checkOutTime).toISOString() : undefined,
        // branch: selectedBranch || data.branch,
        employeeId: data.employeeId?._id || data.employeeId,
      };
      await postData(payload, "attendance");
      toast.success("Attendance Added successfully!");
      reset();
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <FormWrapper>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary.main" align="center">
          Add Attendance
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
           <Grid item xs={12} sm={6}>
  <Controller
    name="employeeId"
    control={control}
    rules={{ required: "Employee is required" }}
    render={({ field }) => (
      <ReusableAutocomplete<any>
        label="Employee"
        value={field.value}
        onChange={field.onChange}
        options={userList?.data || []}
        getOptionLabel={(option) => option?.name || ""}
        isOptionEqualToValue={(opt, val) => opt._id === val._id}
        error={!!errors.employeeId}
        // helperText={errors.employeeId?.message}
      />
    )}
  />
</Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    label="Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date ? date.toDate() : null)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.date,
                        helperText: errors.date?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <InputField
                    label="Status"
                    select
                    {...field}
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </InputField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="checkInTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Check In Time"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(time) => field.onChange(time ? time.toDate() : null)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.checkInTime,
                        helperText: errors.checkInTime?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="checkOutTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Check Out Time"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(time) => field.onChange(time ? time.toDate() : null)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.checkOutTime,
                        helperText: errors.checkOutTime?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <SubmitButton
                loading={isLoading}
                label="Add Attendance"
                loadingLabel="Creating..."
                fullWidth
                sx={{ py: 1.5, fontWeight: "bold", fontSize: 18, mt: 2 }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </FormWrapper>
  );
};

export default AddAttendanceForm;