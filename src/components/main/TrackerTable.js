import React, { useEffect } from "react";
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
  currencies,
  baseCurrency,
  currenciesObj,
  income,
  expenses,
  rowID,
  disabled,
} from "../../trackerSlice";

export default function TrackerTable() {
  const dispatch = useDispatch();
  const tracker = useSelector((state) => state.tracker);

  useEffect(() => {
    axios.get(`https://api.vatcomply.com/rates?base=USD`).then((res) => {
      const response = res.data;
      const entries = Object.entries(response.rates);

      dispatch(currenciesObj(response));
      dispatch(currencies(entries));
      dispatch(baseCurrency(response.base));
    });
  }, [dispatch]);

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
    axios
      .get(`http://localhost:3000/results`)
      .then((res) => {
        dispatch(disabled(true));
        const response = res.data;
        const numbers = response.map(function (x) {
          const obj = {
            id: x.id,
            income: (
              x.income * tracker.currenciesObj.rates[currency]
            ).toString(),
            expenses: (
              x.expenses * tracker.currenciesObj.rates[currency]
            ).toString(),
          };
          return obj;
        });
        return numbers;
      })
      .then((datas) => {
        datas.map((data) => {
          axios.put(`http://localhost:3000/results/${data.id}`, {
            income: data.income,
            expenses: data.expenses,
          });
        });
      })
      .then(() => {
        axios.get(`http://localhost:3000/results`).then((res) => {
          const response = res.data;
          dispatch(values(response));
          dispatch(baseCurrency(currency));
        });
      })
      .then(() => {
        axios
          .get(`https://api.vatcomply.com/rates?base=${currency}`)
          .then((res) => {
            const response = res.data;
            const entries = Object.entries(response.rates);

            dispatch(currenciesObj(response));
            dispatch(currencies(entries));
            dispatch(baseCurrency(response.base));
          });
      })
      .then(() => {
        dispatch(disabled(false));
      })
      .catch(function (error) {
        console.warn(error);
      });
  };

  return (
    <div className="table-wrapper">
      <div className="table-header">
        <div className="row">
          <span>Income</span>
          <span>Expenses</span>
          <span>
            <FormControl fullWidth>
              <InputLabel>Curr.</InputLabel>
              <Select
                disabled={tracker.disabled ? true : false}
                onChange={setCurrency}
                value={tracker.baseCurrency}
                label={tracker.baseCurrency}
              >
                {tracker.currencies &&
                  tracker.currencies.map((currency) => (
                    <MenuItem key={currency[0]} value={currency[0]}>
                      {currency[0]}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </span>
        </div>
      </div>
      <div className="table-body">
        {tracker.values &&
          tracker.baseCurrency &&
          tracker.values.map((value) => (
            <div key={value.id} id={value.id} className="row">
              <span>
                <Currency currency={tracker.baseCurrency}>
                  {value.income}
                </Currency>
              </span>
              <span>
                <Currency currency={tracker.baseCurrency}>
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
    </div>
  );
}
