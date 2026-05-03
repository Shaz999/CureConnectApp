// src/api.js


import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Users API
export const getUsers = () => API.get("/users");
export const addUser = (userData) => API.post("/users", userData);
export const deleteUser = (userId) => API.delete(`/users/${userId}`);

// Appointments API
export const getAppointments = () => API.get("/appointments");
export const addAppointment = (appointmentData) => API.post("/appointments", appointmentData);

export default API;
