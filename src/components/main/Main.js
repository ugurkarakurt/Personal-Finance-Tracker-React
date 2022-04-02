import React, { useEffect } from "react";
import TrackerTable from "./TrackerTable";
import axios from "axios";
import { useDispatch } from "react-redux";
import { values  } from "../../trackerSlice";

export default function Main() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`http://localhost:3000/results`).then((res) => {
      const response = res.data;
      dispatch(values(response));
    });
  }, [dispatch]);
  return (
    <div className="main">
      <TrackerTable />
    </div>
  );
}
