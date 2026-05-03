const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const mongoose = require("mongoose");

// Validation function for checking if ID is valid
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Get doctor information by userId
const getDoctorInfoController = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid or missing userId",
      });
    }

    const doctor = await doctorModel.findOne({ userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching doctor details",
      error: error.message,
    });
  }
};

// Update doctor profile
const updateProfileController = async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;

    // Validate userId
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid or missing userId",
      });
    }

    const doctor = await doctorModel.findOneAndUpdate({ userId }, updateData, { new: true });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in updating doctor profile",
      error: error.message,
    });
  }
};

// Get a single doctor's information by doctorId
const getDoctorByIdController = async (req, res) => {
  try {
    const { doctorId } = req.body;

    // Validate doctorId
    if (!doctorId || !isValidObjectId(doctorId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid or missing doctorId",
      });
    }

    const doctor = await doctorModel.findOne({ _id: doctorId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor information fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching doctor details",
      error: error.message,
    });
  }
};

// Get appointments for a doctor
const doctorAppointmentsController = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid or missing userId",
      });
    }

    const doctor = await doctorModel.findOne({ userId });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointments = await appointmentModel.find({ doctorId: doctor._id });

    res.status(200).send({
      success: true,
      message: "Doctor's appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching doctor appointments",
      error: error.message,
    });
  }
};

// Update appointment status
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;

    // Validate appointmentsId
    if (!appointmentsId || !isValidObjectId(appointmentsId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid or missing appointmentsId",
      });
    }

    // Validate status
    if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid appointment status",
      });
    }

    const appointment = await appointmentModel.findByIdAndUpdate(appointmentsId, { status }, { new: true });

    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    const user = await userModel.findOne({ _id: appointment.userId });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Avoid duplicate notifications
    const notificationMessage = `Your appointment has been updated to ${status}`;
    const existingNotification = user.notifcation.find(
      (notif) => notif.message === notificationMessage
    );

    if (!existingNotification) {
      user.notifcation.push({
        type: "status-updated",
        message: notificationMessage,
        onClickPath: "/doctor-appointments",
      });
      await user.save();
    }

    res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in updating appointment status",
      error: error.message,
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};
