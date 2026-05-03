import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import moment from "moment";
import { message, Table } from "antd";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch doctor appointments
  const getAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/doctor/doctor-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Failed to fetch appointments");
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // Handle appointment status update
  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/doctor/update-status",
        { appointmentId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === record._id ? { ...appointment, status } : appointment
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Something went wrong");
    }
  };

  // Define table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (_, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span className={`badge ${status === "approved" ? "bg-success" : "bg-warning"}`}>
          {status}
        </span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        record.status === "pending" && (
          <div className="d-flex">
            <button
              className="btn btn-success"
              onClick={() => handleStatus(record, "approved")}
            >
              Approve
            </button>
            <button
              className="btn btn-danger ms-2"
              onClick={() => handleStatus(record, "rejected")}
            >
              Reject
            </button>
          </div>
        )
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-3">Appointments List</h1>
      <Table columns={columns} dataSource={appointments} rowKey="_id" />
    </Layout>
  );
};

export default DoctorAppointments;
