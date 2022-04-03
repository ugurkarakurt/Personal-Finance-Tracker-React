import {
 createSlice
} from "@reduxjs/toolkit";

export const trackerSlice = createSlice({
 name: "tracker",
 initialState: {
  values: "",
  income: "",
  expenses: "",
  currencies: "",
  currentCurrency: "USD",
  rowID: "",
  subIncome: 0,
  subExpenses: 0,
  subTotal: 0,
 },
 reducers: {
  values: (state, action) => {
   state.values = action.payload;
   state.subIncome = 0
   state.subExpenses = 0
   for (let i = 0; i < state.values.length; i++) {
    state.subIncome = state.subIncome + Number(state.values[i].income);
    state.subExpenses = state.subExpenses + Number(state.values[i].expenses);
   }
   state.subTotal = state.subIncome + state.subExpenses;
  },
  income: (state, action) => {
   state.income = action.payload;
  },
  expenses: (state, action) => {
   state.expenses = action.payload;
  },
  currencies: (state, action) => {
   state.currencies = action.payload;
  },
  currentCurrency: (state, action) => {
   state.currentCurrency = action.payload;
  },
  rowID: (state, action) => {
   state.rowID = action.payload;
  },
 },
});

export const {
 values,
 income,
 expenses,
 currencies,
 currentCurrency,
 rowID,
 subIncome,
 subExpenses,
 subTotal
} = trackerSlice.actions;

export default trackerSlice.reducer;