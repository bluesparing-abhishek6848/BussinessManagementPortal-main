import { Grid } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import usePost from "../../../../Hooks/usePost";
import InputField from "../../../../lib/InputField";
import { toast } from "react-toastify";
import FormWrapper from "../../../../lib/FormWrapper";
import SubmitButton from "../../../../lib/ButtonWrapper";

interface AddOrderFormProps {
  itemName: string;
  itemImage?: string;
  itemDescription: string;
  quantity: number;
  amountRecieved?: number;
  expenseCost?: number;
  price: number;
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
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InputField
              label="Item Name"
              error={!!errors.itemName}
              register={register("itemName", {
                required: "Item Name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
            />
          </Grid>
    
          <Grid item xs={12} sm={12}>
            <InputField
              label="Description"
              error={!!errors.itemDescription}
              register={register("itemDescription", {
                required: "Description is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              label="Quantity"
              type="number"
              error={!!errors.quantity}
              register={register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Minimum quantity is 1" },
                valueAsNumber: true,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              label="Amount Received"
              type="number"
              error={!!errors.amountRecieved}
              register={register("amountRecieved", {
                min: { value: 0, message: "Cannot be negative" },
                valueAsNumber: true,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <InputField
              label="Expense Cost"
              type="number"
              error={!!errors.expenseCost}
              register={register("expenseCost", {
                min: { value: 0, message: "Cannot be negative" },
                valueAsNumber: true,
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputField
              label="Price"
              type="number"
              error={!!errors.price}
              register={register("price", {
                required: "Price is required",
                min: { value: 0, message: "Cannot be negative" },
                valueAsNumber: true,
              })}
            />
          </Grid>
                    {/* <Grid item xs={12} sm={6}>
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
          <SubmitButton
            loading={isLoading}
            label="Add Order"
            loadingLabel="Creating..."
          />
        </Grid>
      </form>
    </FormWrapper>
  );
};

export default AddOrderForm;