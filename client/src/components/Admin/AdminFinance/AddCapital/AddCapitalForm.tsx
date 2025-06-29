import { Controller, useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";

import { useNavigate } from "react-router-dom";
import usePost from "../../../../Hooks/usePost";
import InputField from "../../../../lib/InputField";
import useGet from "../../../../Hooks/useGet";

import { toast } from "react-toastify";
import { ReusableAutocomplete } from "../../../../lib/ReusableAutocomplete";
import type { IBranchDropDown } from "../../../Common/Branch/OrderTypes";
import type { GetResData } from "../../../Common/Customer/CustomerTypes";
import type { RootState } from "../../../../store";
import { useSelector } from "react-redux";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";

interface AddCapitalFormProps {
  amount: number;
  branch: IBranchDropDown;
}

const AddCapitalForm = () => {
  const navigate = useNavigate();

  const { data: branchData } =
    useGet<GetResData<IBranchDropDown>>("branches/drop-down");
  const { user } = useSelector((state: RootState) => state.auth);
  const { postData, isLoading } = usePost<any, AddCapitalFormProps>();
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AddCapitalFormProps>();

  const onSubmit = async (data: AddCapitalFormProps) => {
    let currentBranchObject: IBranchDropDown | undefined = undefined;

    if (
      user?.branch &&
      typeof user.branch === "object" &&
      "_id" in user.branch &&
      "name" in user.branch
    ) {
      const branch = user.branch as IBranchDropDown;
      currentBranchObject = {
        _id: branch._id,
        name: branch.name,
      };
    }

    const payload: AddCapitalFormProps = {
      amount: data.amount,
      branch: currentBranchObject || data.branch,
    };

    try {
      await postData(payload, "finance");

      toast.success("Capital Added successfully!");

      reset();
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
                  value: 1,
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
                  getOptionLabel={(option) => `${option.name}`}
                  isOptionEqualToValue={(opt, val) => opt._id === val._id}
                  error={!!errors.branch}
                  helperText={errors.branch?.message}
                />
              )}
            />
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                bgcolor: "primary.main",
                py: 1.8,
                fontWeight: "bold",
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              {isLoading ? "Creating..." : "Add Capital"}
            </Button>
          </Grid> */}
          <SubmitButton
            loading={isLoading}
            label="Add Capital"
            loadingLabel="Creating..."
          />
        </Grid>
      </form>
    </FormWrapper>
  );
};

export default AddCapitalForm;
