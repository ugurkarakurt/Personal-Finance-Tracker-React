import React from "react";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { income } from "../../trackerSlice";

export default function Expenses() {
  const dispatch = useDispatch();
  const tracker = useSelector((state) => state.tracker);

  const handleTextFieldChange = function (e) {
    const filteredValue = e.target.value.replace(/-|\s/g, "");
    dispatch(income(filteredValue));
  };

  return (
    <>
      <TextField
        onInput={handleTextFieldChange}
        type="number"
        InputProps={{ inputProps: { min: 0 } }}
        id="income-input"
        label="Income"
        variant="outlined"
        fullWidth
        value={tracker.income}
      />
    </>
  );
}
