const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const mongoose = require("mongoose");

// Validation function for checking if doctorId is valid
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get all users
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users data list fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error: error.message,
    });
  }
};

// Get all doctors
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors data list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching doctors",
      error: error.message,
    });
  }
};

// Change account status for doctor
const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    // Validate doctorId and status
    if (!doctorId || !isValidObjectId(doctorId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    if (status !== "approved" && status !== "disapproved") {
      return res.status(400).send({
        success: false,
        message: "Invalid status. Please use 'approved' or 'disapproved'",
      });
    }

    // Fetch doctor and check if doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    // Update doctor status
    doctor.status = status;
    await doctor.save();

    // Fetch the user related to the doctor
    const user = await userModel.findOne({ _id: doctor.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found for this doctor",
      });
    }

    // Manage the notification and user status
    const notificationMessage = `Your Doctor Account Request Has been ${status === "approved" ? "approved" : "disapproved"}`;
    const existingNotification = user.notifcation.find(
      (notif) => notif.message === notificationMessage
    );

    if (!existingNotification) {
      user.notifcation.push({
        type: "doctor-account-request-updated",
        message: notificationMessage,
        onClickPath: "/notification",
      });
    }

    user.isDoctor = status === "approved" ? true : false;
    await user.save();

    res.status(201).send({
      success: true,
      message: "Account status updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error updating account status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
};
