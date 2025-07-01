import { Controller, useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import usePut from "../../../../Hooks/usePut";
import InputField from "../../../../lib/InputField";
import { ReusableAutocomplete } from "../../../../lib/ReusableAutocomplete";
import { toast } from "react-toastify";
import type { IBranchDropDown } from "../../../Common/Order/OrderTypes";
import useGet from "../../../../Hooks/useGet";
import type { GetResData } from "../../../Common/Customer/CustomerTypes";
import { useEffect } from "react";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";

interface EditCapitalFormProps {
  _id?: string;
  amount: number;
  branch: IBranchDropDown;
}

const EditCapitalForm = ({
  defaultValues,
}: {
  defaultValues: EditCapitalFormProps;
}) => {
  const navigate = useNavigate();
  const { putData, isLoading } = usePut<EditCapitalFormProps>();
  const { data: branchData } =
    useGet<GetResData<IBranchDropDown>>("branches/drop-down");

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EditCapitalFormProps>({ defaultValues });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data: EditCapitalFormProps) => {
    const payload = {
      amount: data.amount,
      branch: data.branch._id, // ✅ only send _id to backend
    };

    try {
      await putData(payload, `finance/${data._id}`);
      toast.success("Capital updated successfully!");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputField
              label="Capital Amount"
              type="number"
              register={register("amount", {
                required: "Capital is required",
                valueAsNumber: true,
                min: {
                  value: 1000,
                  message: "Minimum capital should be ₹1,000",
                },
                max: {
                  value: 1000000000,
                  message: "Capital should not exceed ₹1,000,000,000",
                },
              })}
              inputProps={{ min: 1000, max: 1000000000 }}
              error={!!errors.amount}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="branch"
              control={control}
              rules={{ required: "Branch is required" }}
              render={({ field }) => (
                <ReusableAutocomplete<IBranchDropDown>
                  label="Branch"
                  value={field.value}
                  onChange={field.onChange}
                  options={branchData?.data || []}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(opt, val) => opt._id === val._id}
                  error={!!errors.branch}
                  helperText={errors.branch?.message}
                />
              )}
            />
          </Grid>

          <SubmitButton
            loading={isLoading}
            label="Update Capital"
            loadingLabel="Updating..."
          />
          {/* <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              bgcolor: "primary.main",
              py: 1.9,
              fontWeight: "bold",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {isLoading ? "Updating..." : "Update Capital"}
          </Button>
        </Grid> */}
        </Grid>
      </form>
    </FormWrapper>
  );
};

export default EditCapitalForm;
