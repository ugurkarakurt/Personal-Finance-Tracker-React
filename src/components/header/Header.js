import React from "react";
import axios from "axios";
import uuid from "react-uuid";
import Income from "./Income";
import Expenses from "./Expenses";
import Button from "@mui/material/Button";

import { useDispatch, useSelector } from "react-redux";
import { values, income, expenses, rowID } from "../../trackerSlice";

export default function Header() {
  const dispatch = useDispatch();
  const tracker = useSelector((state) => state.tracker);

  const setValue = () => {
    if (tracker.income && tracker.expenses) {
      if (tracker.rowID) {
        axios
          .put(`http://localhost:3000/results/${tracker.rowID}`, {
            income: tracker.income,
            expenses: tracker.expenses,
          })
          .then(() => {
            axios.get(`http://localhost:3000/results`).then((res) => {
              const response = res.data;
              dispatch(values(response));
            });
          })
          .then(() => {
            dispatch(income(""));
            dispatch(expenses(""));
            dispatch(rowID(""));
          });
      } else {
        axios
          .post("http://localhost:3000/results", {
            id: uuid(),
            income: tracker.income,
            expenses: tracker.expenses,
          })
          .then(() => {
            axios.get(`http://localhost:3000/results`).then((res) => {
              const response = res.data;
              dispatch(values(response));
            });
          })
          .then(() => {
            dispatch(income(""));
            dispatch(expenses(""));
            dispatch(rowID(""));
          });
      }
    }
  };

  return (
    <div className="header" id={tracker.rowID}>
      <div className="income">
        <Income />
      </div>
      <div className="expenses">
        <Expenses />
      </div>
      <div className="actions">
        <Button onClick={() => setValue()} variant="contained">
          {tracker.rowID ? "Edit" : "Add"}
        </Button>
      </div>
    </div>
  );
}
