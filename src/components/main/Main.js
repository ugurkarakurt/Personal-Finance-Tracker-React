import React, { useEffect } from "react";
import TrackerTable from "./TrackerTable";
import axios from "axios";
import { useDispatch } from "react-redux";
import { currencies, values } from "../../trackerSlice";

export default function Main() {
 const dispatch = useDispatch();

 useEffect(() => {
  axios.get(`http://localhost:3000/results`).then((res) => {
   const dataValues = res.data
   axios.get(`https://api.vatcomply.com/rates?base=USD`).then((res) => {
    const currencyList = res.data;
    const entries = Object.entries(currencyList.rates);
    dispatch(currencies(entries));
    dispatch(values(dataValues))
   })
  })
 }, [dispatch]);
 return (
  <div className="main">
   <TrackerTable />
  </div>
 );
}
