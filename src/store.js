import { configureStore } from "@reduxjs/toolkit";
import trackerRecuder from "./trackerSlice";

export default configureStore({
  reducer: { tracker: trackerRecuder },
});
