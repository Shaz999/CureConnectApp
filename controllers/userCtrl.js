const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

// Register callback
const registerController = async (req, res) => {
  try {
    const exisitingUser = await User.findOne({ email: req.body.email });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller Error: ${error.message}`,
    });
  }
};

// Login callback
const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found", success: false });
    }

    // Compare password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Sign JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expiration
    });

    // Send response with token
    res.status(200).send({
      message: "Login successful",
      success: true,
      token, // Send token to frontend
    });
  } catch (error) {
    console.error("Error in loginController:", error);
    res.status(500).send({
      message: `Error in loginController: ${error.message}`,
      success: false,
    });
  }
};

// Apply Doctor Controller
const applyDoctorController = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("Received userId:", userId); // Debug log

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is missing" });
    }

    const user = await User.findById(userId);

    console.log("Fetched user:", user); // Debug log

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.notification) {
      user.notification = [];
    }

    user.notification.push({
      type: "apply-doctor-request",
      message: "New doctor application received",
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Doctor application submitted",
    });
  } catch (error) {
    console.error("Error in applyDoctorController:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getAllNotificationController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Push notifications to seenNotifications and clear notifications array
    const seennotification = user.seennotification;
    const notifcation = user.notification;

    seennotification.push(...notifcation);
    user.notification = [];
    user.seennotification = notifcation;

    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// Notification Controller: Delete All Notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to delete all notifications",
      error,
    });
  }
};

// Get All Doctors Controller
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching doctors",
    });
  }
};

// Book Appointment Controller
// Book Appointment Controller (Updated)
const bookAppointmentController = async (req, res) => {
  try {
    const { date, time, doctorInfo, userInfo } = req.body;
    
    if (!date || !time || !doctorInfo || !userInfo) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
      });
    }

    const formattedDate = moment(date, "DD-MM-YYYY").toISOString();
    const formattedTime = moment(time, "HH:mm").toISOString();

    // Default appointment status to "pending"
    const newAppointment = new appointmentModel({
      ...req.body,
      date: formattedDate,
      time: formattedTime,
      status: "pending",
    });

    await newAppointment.save();

    const doctorUser = await User.findById(doctorInfo.userId);
    doctorUser.notification.push({
      type: "New-appointment-request",
      message: `A new appointment request from ${userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await doctorUser.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log("Error in bookAppointmentController:", error);
    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error,
    });
  }
};

// Booking Availability Controller
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in booking",
    });
  }
};
// Get User Data Controller
// Get User Data Controller
const getUserDataController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get user data from decoded JWT ID

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined; // Ensure password is not sent

    res.status(200).send({
      success: true,
      message: "User data fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error in getUserDataController:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching user data",
      error,
    });
  }
};

// User Appointments Controller
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.user.id, // Use authenticated user ID
    });

    res.status(200).send({
      success: true,
      message: "User's appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching user appointments",
    });
  }
};

// Export all controllers
module.exports = {
  loginController,
  registerController,
  getUserDataController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,  
  bookAppointmentController, 
  bookingAvailabilityController,
  userAppointmentsController,
};

