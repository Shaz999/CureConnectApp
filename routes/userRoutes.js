const express = require("express");
const {
  loginController,
  registerController,
  getUserDataController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  userAppointmentsController,
  bookAppointmentController,
  bookingAvailabilityController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Login Route (No authentication required)
router.post("/login", loginController);

// Register Route (No authentication required)
router.post("/register", registerController);

// Get User Data (Requires authentication)
router.get("/getUserData", authMiddleware, getUserDataController);

// Apply Doctor (Requires authentication)
router.post("/apply-doctor", authMiddleware, applyDoctorController);

// Book Appointment (Requires authentication)
router.post("/book-appointment", authMiddleware, bookAppointmentController);

// Booking Availability (Requires authentication)
router.post("/book-availability", authMiddleware, bookingAvailabilityController);

// Get All Notifications (Requires authentication)
router.get("/get-all-notification", authMiddleware, getAllNotificationController);

// Delete All Notifications (Requires authentication)
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);

// Get All Approved Doctors (Requires authentication)
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

// Get User Appointments (Requires authentication)
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
