import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { toast } from "react-toastify";
import useGet from "../../Hooks/useGet";

interface FinanceControllerDetails {
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  controllerName?: string;
  controllerEmail?: string;
}

const AdminDashboard = () => {
  const [financeDetails, setFinanceDetails] = useState<FinanceControllerDetails | null>(null);

  // Fetch finance controller details using useGet hook
  const { data, isLoading, error } = useGet<{ data: FinanceControllerDetails }>("finance/advance-summary");

  useEffect(() => {
    console.log("Data fetched:", data);
    if (data && data?.data) {
      setFinanceDetails(data?.data);
    }
    if (error) {
      setFinanceDetails(null);
    }
  }, [data, error]);

  if (error) {
    toast.error(error);
    return null;
  }

  return (
    <div>
      <Box my={3}>
        <Card sx={{ bgcolor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Finance Controller Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : financeDetails ? (
              <>
                <Typography>Total Profit: ₹{financeDetails.totalProfit ?? 0}</Typography>
           
                  <Typography>Total Income: ₹{financeDetails.totalIncome ?? 0}</Typography>
               
       
                  <Typography>Total Expense: ₹{financeDetails.totalExpense ?? 0}</Typography>
              
              </>
            ) : (
              <Typography>No finance controller details available.</Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default AdminDashboard;