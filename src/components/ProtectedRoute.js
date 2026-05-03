import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/getUserData",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.clear();
        navigate("/login"); // Navigate properly instead of returning JSX
      }
    } catch (error) {
      localStorage.clear();
      dispatch(hideLoading());
      navigate("/login"); // Navigate properly
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]); // Removed getUser from dependencies

  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}
