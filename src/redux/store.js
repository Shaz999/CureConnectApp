import { configureStore } from "@reduxjs/toolkit";
import alertReducer from "./features/alertSlice";
import userReducer from "./features/userSlice";

export default configureStore({
  reducer: {
    alerts: alertReducer,
    user: userReducer,
  },
});
