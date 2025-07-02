import { Grid, Typography, Paper, Box } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import usePost from "../../../../Hooks/usePost";
import InputField from "../../../../lib/InputField";
import { toast } from "react-toastify";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";

interface AddOrderFormProps {
  customerName: string;
  itemName: string;
  itemImage?: string;
  itemDescription: string;
  quantity: number;
  amountRecieved?: number;
  expenseCost?: number;
  price: number;
  date: string;
}

const AddOrderForm = () => {
  const { postData, isLoading } = usePost<any, AddOrderFormProps>();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AddOrderFormProps>();

  const onSubmit = async (data: AddOrderFormProps) => {
    try {
      await postData(data, "orders");
      toast.success("Order added successfully!");
      reset();
      navigate(-1);
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <Box
      // minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f6fa"
    >
      <FormWrapper>
        <Paper
          elevation={6}
          style={{
            padding: 40,
            margin: "20px auto",
            maxWidth: 1000, // Increased width for desktop
            width: "100%",
            borderRadius: 18,
            background: "linear-gradient(135deg, #e0e7ff 0%, #fff 100%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            transition: "max-width 0.3s",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{
              fontWeight: 700,
              color: "#3f51b5",
              letterSpacing: 1,
              marginBottom: 24,
            }}
          >
            Add New Order
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InputField
                  label="Customer Name"
                  error={!!errors.customerName}
                  register={register("customerName", {
                    required: "Customer Name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  label="Item Name"
                  error={!!errors.itemName}
                  register={register("itemName", {
                    required: "Item Name is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Order Date"
                  type="date"
                  error={!!errors.date}
                  register={register("date", {
                    required: "Order date is required",
                  })}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Quantity"
                  type="number"
                  error={!!errors.quantity}
                  register={register("quantity", {
                    required: "Quantity is required",
                    min: { value: 1, message: "Minimum quantity is 1" },
                    valueAsNumber: true,
                  })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  label="Description"
                  error={!!errors.itemDescription}
                  register={register("itemDescription", {
                    required: "Description is required",
                    minLength: { value: 2, message: "Minimum 2 characters" },
                  })}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Amount Received"
                  type="number"
                  error={!!errors.amountRecieved}
                  register={register("amountRecieved", {
                    min: { value: 0, message: "Cannot be negative" },
                    valueAsNumber: true,
                  })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputField
                  label="Expense Cost"
                  type="number"
                  error={!!errors.expenseCost}
                  register={register("expenseCost", {
                    min: { value: 0, message: "Cannot be negative" },
                    valueAsNumber: true,
                  })}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <InputField
                  label="Price"
                  type="number"
                  error={!!errors.price}
                  register={register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Cannot be negative" },
                    valueAsNumber: true,
                  })}
                  fullWidth
                />
              </Grid>
              {/* <Grid item xs={12}>
                <InputField
                  // label="Item Image"
                  type="file"
                  inputProps={{ accept: "image/*" }}
                  error={!!errors.itemImage}
                  register={register("itemImage")}
                  fullWidth
                  helperText="Upload an image of the item (optional)"
                />
              </Grid> */}
              <Grid item xs={12} style={{ textAlign: "center", marginTop: 16 }}>
                <SubmitButton
                  loading={isLoading}
                  label="Add Order"
                  loadingLabel="Creating..."
                  style={{
                    minWidth: 180,
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                />
              </Grid>
            </Grid>
          </form>
        </Paper>
      </FormWrapper>
    </Box>
  );
};

export default AddOrderForm;