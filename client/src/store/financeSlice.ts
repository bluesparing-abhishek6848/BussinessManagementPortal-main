
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';


 interface  Finance {
    capital: number;
    revenue: number;
    distributedAmount: number;
    remainingAmount: number;
    createdBy: string;
    updatedBy: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    profit: number;
  }
interface FinanceState {
  data: Finance | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FinanceState = {
  data: null,
  isLoading: false,
  error: null,
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    setFinanceData(state, action: PayloadAction<Finance>) {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setFinanceData, setLoading, setError } = financeSlice.actions;
export default financeSlice.reducer;
