import { Grid } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import usePost from "../../../../Hooks/usePost";
import useGet from "../../../../Hooks/useGet";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";
import { ReusableAutocomplete } from "../../../../lib/ReusableAutocomplete";
// import type { IUserDropDown } from "../../User/UserTypes";
import type { RootState } from "../../../../store";
import React from "react";

const advanceSchema = z.object({
  employee: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  advanceAmount: z.number().min(1, "Advance amount must be greater than 0"),
  date: z.string().optional(), // <-- Add this line
});

type AdvanceData = z.infer<typeof advanceSchema>;

const AddAdvanceForm = () => {
  const { user } = useSelector((state: RootState) => state.auth);


  // const branchId = user?.branch?._id;
  const { data: userList } = useGet<{ data: any }>(`employees`);


  const navigate = useNavigate();
  const { data, postData, isLoading, error, onClose } = usePost<any, any>();

  const {
    control,
    handleSubmit,
    setValue,
    // getValues,
    reset,
    formState: { errors },
  } = useForm<AdvanceData>({
    resolver: zodResolver(advanceSchema),
    defaultValues: {
      employee: undefined,
      advanceAmount: 0,
    },
  });

  const onSubmit = async (data: AdvanceData) => {
    const payload: any = {
      employeeId: data.employee._id,
      advanceAmount: data.advanceAmount,
    };
    if (data.date) payload.date = data.date; // <-- Add this line
    await postData(payload, "advances");
  };

  // Success effect
  React.useEffect(() => {
    if (data?.success) {
      reset();
      navigate(-1);
    }
  }, [data, reset, navigate]);

  // Error effect
  React.useEffect(() => {
    if (error) {
      toast.error(error || "An unexpected error occurred.");
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="employee"
              control={control}
              rules={{ required: "Employee is required" }}
              render={({ field }) => (
                <ReusableAutocomplete<any>
                  label="Employee"
                  value={field.value}
                  onChange={field.onChange}
                  options={userList?.data || []}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(opt, val) => opt._id === val._id}
                  error={!!errors.employee}
                  helperText={errors.employee?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="advanceAmount"
              control={control}
              rules={{ required: "Advance amount is required" }}
              render={({ field }) => (
                <TextField
                  label="Advance Amount"
                  type="string"
                  fullWidth
                  error={!!errors.advanceAmount}
                  helperText={errors.advanceAmount?.message}
                  {...field}
                  onChange={(e) =>
                    setValue("advanceAmount", Number(e.target.value))
                  }
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Advance Date"
                  type="datetime-local"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <SubmitButton
              loading={isLoading}
              label="Create Advance"
              loadingLabel="Creating..."
            />
          </Grid>
        </Grid>
      </form>
    </FormWrapper>
  );
};

export default AddAdvanceForm;
