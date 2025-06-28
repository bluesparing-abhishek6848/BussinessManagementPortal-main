interface FinanceInfo {
    _id: string;
    capital: number;
    profit: number;
    distributedAmount: number;
    remainingAmount: number;
  }
  
  interface CollectionSummary {
    Paid: number;
    UnPaid: number;
    Advance: number;
  }
  
  interface LoansByStatus {
    [status: string]: number; 
  }
  
export  interface AdminDashboardData {
    finance: FinanceInfo | null;
    todayCollectionSummary: CollectionSummary;
    loansByStatus: LoansByStatus;
    customersCount: number;
  }

    
export  interface CollectionDashboardData {
  todayCollectionSummary: CollectionSummary;
  assignLoans:number
}
  
export  interface AdminDashboardResponse {
    statusCode: number;
    data: AdminDashboardData;
    message: string;
    success: boolean;
  }
  
  export  interface CollectionDashboardResponse {
    statusCode: number;
    data: CollectionDashboardData;
    message: string;
    success: boolean;
  }
  