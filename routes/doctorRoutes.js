const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// GET METHOD || SINGLE DOCTOR INFO
router.get("/getDoctorInfo", authMiddleware, getDoctorInfoController);

// POST METHOD || UPDATE PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

// GET METHOD || GET SINGLE DOCTOR INFO BY ID
router.get("/getDoctorById", authMiddleware, getDoctorByIdController);

// GET METHOD || DOCTOR APPOINTMENTS
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController);

// POST METHOD || UPDATE STATUS
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
