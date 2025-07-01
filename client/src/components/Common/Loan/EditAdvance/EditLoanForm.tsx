import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import { Controller, useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useGet from "../../../../Hooks/useGet";
import usePut from "../../../../Hooks/usePut";
import { ReusableAutocomplete } from "../../../../lib/ReusableAutocomplete";
import type {
  ICustomerDropDown,
  GetResData,
} from "../../Customer/CustomerTypes";
import type { IBranch, IBranchDropDown } from "../../Order/OrderTypes";
import type { IUserDropDown } from "../../Employee/UserTypes";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import { toast } from "react-toastify";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";

const customerSchema = z.object({
  _id: z.string(),
  name: z.string(),
  customerId: z.string(),
});

const loanSchema = z.object({
  collecting_person: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  customer: customerSchema,

  amount: z.number().min(1, "Amount must be greater than 0"),
  interestRate: z.number().min(0, "Interest rate is required"),
  tenure: z.number().min(1, "Tenure must be at least 1 day"),
  emiPerDay: z.number().min(1, "EMI per day is required"),

  guarantorName: z.string().min(1, "Guarantor name is required"),
  guarantorPhone: z
    .string()
    .regex(/^\d{10}$/, "Guarantor phone must be 10 digits")
    .transform((val) => String(val)),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Start date is invalid",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "End date is invalid",
  }),
});
type LoanData = z.infer<typeof loanSchema>;

const EditLoanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: loanDataRes } = useGet<any>(`loans/${id}`);
  const branch = user?.branch as IBranch;
  const { data: customerList } = useGet<GetResData<ICustomerDropDown>>(
    `customers/drop-down?branch=${branch?._id}`
  );
  const { data: userList } = useGet<GetResData<IUserDropDown>>(
    `users/drop-down?branch=${branch._id}`
  );
  const { data: branchList } =
    useGet<GetResData<IBranchDropDown>>("branches/drop-down");
  const { putData, isLoading: isUpdating } = usePut<any, LoanData>();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm<LoanData>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      customer: undefined,

      amount: 0,
      interestRate: 0,
      tenure: 100,
      emiPerDay: 0,

      guarantorName: "",
      guarantorPhone: "",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (loanDataRes?.data && customerList?.data && branchList?.data) {
      const customer = customerList.data.find(
        (c) => c._id === loanDataRes.data.customer
      );

      const branchId =
        loanDataRes.data.branch?._id ||
        loanDataRes.data.collecting_person?.branch?._id ||
        loanDataRes.data.collecting_person?.branch;
      const branch = branchList.data.find((b) => b._id === branchId);

      reset({
        ...loanDataRes.data,
        customer: customer || null,
        branch: branch || null,
        startDate: loanDataRes.data.startDate
          ? loanDataRes.data.startDate.split("T")[0]
          : "",
        endDate: loanDataRes.data.endDate
          ? loanDataRes.data.endDate.split("T")[0]
          : "",
        guarantorPhone: String(loanDataRes.data.guarantorPhone || ""),
      });
    }
  }, [loanDataRes, customerList, branchList, reset]);

  const amount = watch("amount");
  const interestRate = watch("interestRate");
  const tenure = watch("tenure");
  const startDate = watch("startDate");

  useEffect(() => {
    if (amount && interestRate && tenure) {
      const interest = (amount * interestRate * tenure) / 100;

      const emiPerDay = Math.ceil(interest / tenure);
      setValue("emiPerDay", emiPerDay);
    }
  }, [amount, interestRate, tenure, setValue]);

  useEffect(() => {
    if (startDate && tenure) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + tenure);
      const endDateStr = start.toISOString().split("T")[0];
      setValue("endDate", endDateStr);
    }
  }, [startDate, tenure, setValue]);

  const onSubmit = async (data: LoanData) => {
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

    const payload = {
      ...data,
      customer: {
        _id: data.customer._id,
        name: data.customer.name,
        customerId: data.customer.customerId,
      },
      branch: currentBranchObject,
    };

    try {
      await putData(payload, `loans/${id}`);
      toast.success("Loan updated successfully");
      reset();
      navigate(-1);
    } catch (err: any) {
      toast.error(err?.message || "Server error!");
    }
  };

  const handleChange =
    (field: keyof LoanData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isNumberField = [
        "amount",
        "interestRate",
        "tenure",
        "emiPerDay",
      ].includes(field);
      setValue(field, isNumberField ? Number(e.target.value) : e.target.value, {
        shouldValidate: true,
      });
    };

  const loanFields = [
    { label: "Guarantor Name", name: "guarantorName" },
    {
      label: "Guarantor Phone",
      name: "guarantorPhone",
      inputProps: { maxLength: 10 },
    },
    { label: "Amount", name: "amount", type: "number" },
    { label: "Interest Rate (%)", name: "interestRate", type: "number" },
    { label: "Tenure (days)", name: "tenure", type: "number" },
    { label: "EMI per Day", name: "emiPerDay", type: "number", disabled: true },
  ];

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="customer"
              control={control}
              render={({ field }) => {
                const selectedCustomer =
                  customerList?.data.find((c) => c._id === field.value?._id) ||
                  null;
                return (
                  <ReusableAutocomplete<ICustomerDropDown>
                    label="Customer"
                    value={selectedCustomer}
                    onChange={field.onChange}
                    options={customerList?.data || []}
                    getOptionLabel={(opt) => `${opt.name}`}
                    isOptionEqualToValue={(a, b) => a._id === b._id}
                    error={!!errors.customer}
                    helperText={errors.customer?.message}
                  />
                );
              }}
            />
          </Grid>

          {/* <Grid size={{ xs: 12, sm: 6 }}>
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
        </Grid> */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="collecting_person"
              control={control}
              rules={{ required: "Collecting person is required" }}
              render={({ field }) => {
                const selectedUser =
                  userList?.data.find((u) => u._id === field.value?._id) ||
                  null;
                return (
                  <ReusableAutocomplete<IUserDropDown>
                    label="Collection Manager"
                    value={selectedUser}
                    onChange={field.onChange}
                    options={userList?.data || []}
                    getOptionLabel={(option) => `${option.name}`}
                    isOptionEqualToValue={(opt, val) => opt._id === val._id}
                    error={!!errors.collecting_person}
                    helperText={errors.collecting_person?.message}
                  />
                );
              }}
            />
          </Grid>
          {loanFields.map((field) => (
            <Grid size={{ xs: 12, sm: 6 }} key={field.name}>
              <Controller
                name={field.name as keyof LoanData}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    type={field.type || "text"}
                    label={field.label}
                    fullWidth
                    disabled={field.disabled}
                    onChange={handleChange(field.name as keyof LoanData)}
                    inputProps={field.inputProps || {}}
                    error={!!errors[field.name as keyof LoanData]}
                    helperText={
                      errors[field.name as keyof LoanData]?.message as string
                    }
                  />
                )}
              />
            </Grid>
          ))}

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
              onChange={handleChange("startDate")}
              value={getValues("startDate") || ""}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
              onChange={handleChange("endDate")}
              value={getValues("endDate") || ""}
            />
          </Grid>

          {/* <Grid size={{ xs: 12, sm: 6 }}></Grid> */}

          {/* <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isUpdating}
            sx={{
              py: 1.9,
              fontWeight: "bold",
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {isUpdating ? "Updating..." : "Update Loan"}
          </Button>
        </Grid> */}
          <SubmitButton
            loading={isUpdating}
            label="Update Loan"
            loadingLabel="Updating..."
          />
          {/* 
        {error && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )} */}
        </Grid>
      </form>
    </FormWrapper>
  );
};

export default EditLoanForm;
