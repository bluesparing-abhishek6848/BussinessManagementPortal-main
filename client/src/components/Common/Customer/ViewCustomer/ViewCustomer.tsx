import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useLocation } from "react-router-dom";
import type { ICustomer } from "../CustomerTypes";
import useGet from "../../../../Hooks/useGet";
import type { ILoan } from "../../Loan/LoanTypes";
import { useState } from "react";
import { formatDate } from "../../../../Constant";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import TransactionAccordion from "./TransactionAccordion";

const ViewCustomer = () => {
  const loc = useLocation();
  const customerData = loc.state as ICustomer;
  const {
    data: loanData,
    isLoading,
    error,
  } = useGet<any>(`loans/customer/${customerData._id}`);

  if (isLoading)
    return <Typography p={2}>Loading customer loans...</Typography>;
  if (error)
    return (
      <Typography p={2} color="error">
        Failed to load loan data
      </Typography>
    );

  const openLoan: ILoan[] = loanData?.data?.openLoan || [];
  const closedLoan: ILoan[] = loanData?.data?.closedLoan || [];

  return (
    <Box p={2}>
      <CustomerLoanDetails
        customer={customerData}
        openLoan={openLoan}
        closedLoan={closedLoan}
      />
    </Box>
  );
};

export default ViewCustomer;

interface ViewCustomerProps {
  customer: ICustomer;
  openLoan: ILoan[];
  closedLoan: ILoan[];
}

const CustomerLoanDetails: React.FC<ViewCustomerProps> = ({
  customer,
  openLoan,
  closedLoan,
}) => {
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");

  return (
    <Box maxWidth="md" mx="auto">
      {/* Customer Info Card */}
      <Card elevation={3} sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6">{customer.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Customer ID: {customer.customerId}
            </Typography>
            <Box display="flex" gap={2} alignItems="center" mt={1}>
              <PhoneIcon fontSize="small" color="action" />
              <Typography variant="body2">{customer.phone}</Typography>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <HomeIcon fontSize="small" color="action" />
              <Typography variant="body2">{customer.address}</Typography>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <BadgeIcon fontSize="small" color="action" />
              <Typography variant="body2">Aadhar: {customer.aadhar}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Created At: {formatDate(customer.createdAt)}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="Active Loans" value="open" />
        <Tab label="Closed Loans" value="closed" />
        <Tab label="Overdue Loans" value="overdue" />
      </Tabs>

      {/* Loan Cards */}
      <Grid container spacing={2}>
        {(activeTab === "open" ? openLoan : closedLoan).map((loan) => (
          <Grid size={{ xs: 12 }} key={loan._id}>
            <Card variant="outlined">
              <CardContent>
                <Grid container justifyContent="space-between">
                  <Grid>
                    <Typography variant="h6" color="primary">
                      ₹{loan.amount}
                    </Typography>
                    <Typography variant="body2">
                      EMI / Day: ₹{loan.emiPerDay}
                    </Typography>
                    <Typography variant="body2">
                      Paid EMI: {loan.paidEmi}/{loan.tenure}
                    </Typography>
                  </Grid>
                  <Grid textAlign="right">
                    <Typography variant="body2">
                      Start: {formatDate(loan.startDate)}
                    </Typography>
                    <Typography variant="body2">
                      End: {formatDate(loan.endDate)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={loan.status === "open" ? "green" : "red"}
                    >
                      Status: {loan.status}
                    </Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" mt={1}>
                  Guarantor: {loan.guarantorName} ({loan.guarantorPhone})
                </Typography>
                <Typography variant="body2" mt={1}>
                  <Accordion
                    sx={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon  />}
                      sx={{
                        // bgcolor: "#7E8EF1",
                        borderRadius: "0px",
                        // color: "#fff",
                        fontWeight: "bold",
                        transition: "background-color 0.3s ease",
                        // "&:hover": {
                        //   bgcolor: "#615EFC",
                        //   color: "#fff",
                        // },
                        "& .MuiAccordionSummary-expandIconWrapper": {
                          transition: "transform 0.3s ease",
                        },
                        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded":
                          {
                            transform: "rotate(180deg)",
                            // color: "secondary.main",
                          },
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        View Transactions
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        bgcolor: "background.paper",
                      }}
                    >
                      <Divider sx={{ mb: 2 }} />
                      <TransactionAccordion loanId={loan._id} />
                    </AccordionDetails>
                  </Accordion>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {(activeTab === "open" ? openLoan : closedLoan).length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Typography align="center" color="text.secondary">
              No {activeTab === "open" ? "active" : "closed"} loans found.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
