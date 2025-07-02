import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { Controller, useForm } from "react-hook-form";
import InputField from "../../../../lib/InputField";

import usePut from "../../../../Hooks/usePut";
import useGet from "../../../../Hooks/useGet";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReusableAutocomplete } from "../../../../lib/ReusableAutocomplete";
// import type { IBranchDropDown } from "../../Order/OrderTypes";
import type { GetResData } from "../../Customer/CustomerTypes";
import { toast } from "react-toastify";
import SubmitButton from "../../../../lib/ButtonWrapper";
import FormWrapper from "../../../../lib/FormWrapper";

interface EditUsersFormProps {
  name: string;
  phone: string;
  email: string;
  role: string;
  branch: any;
}

const roles = [
  { label: "Branch Manager", value: "branchManager" },
  { label: "Collection Manager", value: "collectionManager" },
  { label: "Account Manager", value: "accountManager" },
];

const EditUserForm = ({
  defaultValues,
}: {
  defaultValues: EditUsersFormProps;
}) => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const {
    putData,
    isLoading: isUpdating,
    error,
  } = usePut<any, EditUsersFormProps>();
  const { data: branchData } =
    useGet<GetResData<any>>("branches/drop-down");
  const branchList = useMemo(() => branchData?.data || [], [branchData]);
  const roleList = useMemo(() => roles, []);
  const {
    handleSubmit,
    register,
    reset,
    control,
    setValue,
    watch, // <-- Add this
    formState: { errors },
  } = useForm<EditUsersFormProps>({ defaultValues });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const userJson = localStorage.getItem("user");
  const currentUserRole = userJson ? JSON.parse(userJson).role : null;

  useEffect(() => {
    if (currentUserRole === "branchManager") {
      setValue("role", "collectionManager");
    }
  }, [currentUserRole, setValue]);

  const onSubmit = async (formData: EditUsersFormProps) => {
    try {
      await putData(formData, `users/${userId}`);

      toast.success("User updated successfully!");
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  const selectedRole = watch("role"); // <-- Add this

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InputField
              label="Full Name"
              register={register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.name}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <InputField
              label="Email"
              type="email"
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.email}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <InputField
              label="Phone Number"
              type="tel"
              inputProps={{ maxLength: 10 }}
              register={register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Must be exactly 10 digits",
                },
              })}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.phone}
            />
          </Grid>

          {currentUserRole !== "branchManager" && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <InputField
                    label="Select Role"
                    select
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.role}
                    helperText={errors.role?.message}
                    disabled // <-- Make the field disabled
                    {...field}
                  >
                    {roleList.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </InputField>
                )}
              />
            </Grid>
          )}
          {currentUserRole !== "branchManager" &&
            selectedRole !== "accountManager" && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="branch"
                  control={control}
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <ReusableAutocomplete<any>
                      label="Branch"
                      value={field.value}
                      onChange={field.onChange}
                      options={branchList || []}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(opt, val) => opt._id === val._id}
                      error={!!errors.branch}
                      // helperText={errors.branch?.message}
                    />
                  )}
                />
              </Grid>
            )}

          {/* <Grid size={{ xs: 12, sm: 6 }}></Grid>
        <Grid size={{ xs: 12, sm: 6 }}></Grid> */}
          <SubmitButton
            loading={isUpdating}
            label="Update User"
            loadingLabel="Updating..."
          />
          {error && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Grid>
          )}
        </Grid>
      </form>
    </FormWrapper>
  );
};

export default React.memo(EditUserForm);
