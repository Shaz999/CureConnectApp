import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card m-2"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)} // Fixed navigate URL
    >
      <div className="card-header">
        Dr. {doctor.firstName} {doctor.lastName}
      </div>
      <div className="card-body">
        <p>
          <b>Specialization:</b> {doctor.specialization}
        </p>
        <p>
          <b>Experience:</b> {doctor.experience} years
        </p>
        <p>
          <b>Fees Per Consultation:</b> {doctor.feesPerConsultation} {/* Fixed spelling */}
        </p>
        <p>
          <b>Timings:</b> {doctor.timings?.[0] || "N/A"} - {doctor.timings?.[1] || "N/A"} {/* Fixed potential undefined error */}
        </p>
      </div>
    </div>
  );
};

export default DoctorList;
