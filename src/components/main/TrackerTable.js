import React from "react";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { Currency } from "react-intl-number-format";
import { useDispatch, useSelector } from "react-redux";

import {
 values,
 income,
 expenses,
 rowID,
 currentCurrency
} from "../../trackerSlice";

export default function TrackerTable() {
 const dispatch = useDispatch();
 const tracker = useSelector((state) => state.tracker);

 const removeRow = (e) => {
  const row = e.target.closest(".row");
  axios.delete(`http://localhost:3000/results/${row.id}`).then(() => {
   axios.get(`http://localhost:3000/results`).then((res) => {
    if (!res.data.length) {
     dispatch(income(""));
     dispatch(expenses(""));
     dispatch(rowID(""));
    }
    const response = res.data;
    dispatch(values(response));
   });
  });
 };

 const editRow = (e) => {
  const row = e.target.closest(".row");
  axios.get(`http://localhost:3000/results/${row.id}`).then((res) => {
   const response = res.data;
   dispatch(income(response.income));
   dispatch(expenses(response.expenses));
   dispatch(rowID(response.id));
  });
 };


 const setCurrency = (e) => {
  const currency = e.target.value;
  dispatch(currentCurrency(e.target.value))
  axios.get(`http://localhost:3000/results`).then((res) => {
   const dataValues = res.data
   axios.get(`https://api.vatcomply.com/rates?base=USD`).then((res) => {
    const currencyList = res.data;
    const numbers = dataValues.map(function (x) {
     const obj = {
      id: x.id,
      income: (
       x.income * currencyList.rates[currency]
      ).toString(),
      expenses: (
       x.expenses * currencyList.rates[currency]
      ).toString(),
     };
     return obj;
    });
    dispatch(values(numbers))
   })
  })

 };

 return (
  <div className="table-wrapper">
   <div className="table-header">
    <div className="row">
     <span>Income</span>
     <span>Expenses</span>
     <span>
      {tracker.currencies.length > 0 &&
       <FormControl fullWidth>
        <InputLabel>Currency</InputLabel>
        <Select
         onChange={setCurrency}
         defaultValue="USD"
        >
         {tracker.currencies.map((currency) => (
          <MenuItem key={currency[0]} value={currency[0]}>
           {currency[0]}
          </MenuItem>
         ))}
        </Select>
       </FormControl>
      }
     </span>
    </div>
   </div>
   <div className="table-body">
    {tracker.values &&
     tracker.values.map((value) => (
      <div key={value.id} id={value.id} className="row">
       <span>
        <Currency currency={tracker.currentCurrency}>
         {value.income}
        </Currency>
       </span>
       <span>
        <Currency currency={tracker.currentCurrency}>
         {value.expenses}
        </Currency>
       </span>

       <span className="actions">
        <IconButton onClick={removeRow} aria-label="delete">
         <DeleteIcon />
        </IconButton>
        <IconButton onClick={editRow} aria-label="edit">
         <SyncAltIcon />
        </IconButton>
       </span>
      </div>
     ))}
   </div>
   <div className="table-footer">
    <div className="row">
     <span>
      <Currency currency={tracker.currentCurrency}>
       {tracker.subIncome}
      </Currency>
     </span>
     <span>
      <Currency currency={tracker.currentCurrency}>
       {tracker.subExpenses}
      </Currency>
     </span>
     <span className="total">
      <Currency currency={tracker.currentCurrency}>
       {tracker.subTotal}
      </Currency>
     </span>
    </div>
   </div>
  </div>
 );
}
