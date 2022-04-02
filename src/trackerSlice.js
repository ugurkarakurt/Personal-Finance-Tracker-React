import { createSlice } from "@reduxjs/toolkit";

export const trackerSlice = createSlice({
  name: "tracker",
  initialState: {
    values: "",
    income: "",
    expenses: "",
    currencies: "",
    baseCurrency: "",
    newCurrency: "",
    currenciesObj: "",
    rowID: "",
  },
  reducers: {
    values: (state, action) => {
      state.values = action.payload;
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
    currenciesObj: (state, action) => {
      state.currenciesObj = action.payload;
    },
    baseCurrency: (state, action) => {
      state.baseCurrency = action.payload;
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
  baseCurrency,
  newCurrency,
  currenciesObj,
  rowID,
} = trackerSlice.actions;

export default trackerSlice.reducer;
