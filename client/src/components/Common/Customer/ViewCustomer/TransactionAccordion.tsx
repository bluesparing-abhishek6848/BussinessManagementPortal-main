import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import useGet from "../../../../Hooks/useGet";
import { toast } from "react-toastify";
import { useEffect } from "react";

const TransactionAccordion = ({ loanId }: { loanId: string }) => {
  const {
    data: transactionData,
    isLoading,
    error,
  } = useGet<any>(`collection/loan/${loanId}`);

  useEffect(() => {
    if (error) toast.error(`Transaction Error: ${error}`);
  }, [error]);

  const transactions = transactionData?.collections || [];

  if (isLoading) return <Typography>Loading transactions...</Typography>;

  if (transactions.length === 0)
    return <Typography>No transactions found.</Typography>;

  return (
    <Grid container spacing={2}>
      {transactions.map((txn: any, index: number) => {
        const emiPerDay = txn?.loan?.emiPerDay || 0;
        const total = emiPerDay * txn.emiCount;
        const collectedByName =
          txn?.collecting_person?.name || txn?.collecting_person || "N/A";
        const branchName = txn?.branch?.name || txn?.branch || "N/A";
        return (
          <Grid size={{ xs: 12 }} key={index}>
            <Grid container justifyContent="space-between">
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body2">
                  EMIs Paid: {txn.emiCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Collected By (ID): {collectedByName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Branch: {branchName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status:{" "}
                  <span
                    style={{
                      color: txn.status === "Advance" ? "#2563eb" : "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    {txn.status}
                  </span>
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} textAlign={"right"}>
                <Typography variant="body2" color="text.secondary">
                  Date: {new Date(txn.collectionDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  EMI Amount: ₹{emiPerDay}
                </Typography>
                <Typography variant="body2">
                  Total Collected: ₹{total}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TransactionAccordion;
