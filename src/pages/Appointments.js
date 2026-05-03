import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table, message } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments
  const getAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(res.data); // This will log only the actual response data

      if (res.data.success) {
        setAppointments(res.data.data); // Populate appointments with the fetched data
      } else {
        message.error(res.data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      // Improved error handling
      console.error("Error fetching appointments:", error.response || error);
      message.error(
        error.response?.data?.message || "Something went wrong while fetching appointments"
      );
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // Columns with sorting and filtering options
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      sorter: (a, b) => a._id.localeCompare(b._id), // Enable sorting by ID
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {record.time ? moment(record.time).format("HH:mm") : "Not available"}
        </span>
      ),
      sorter: (a, b) => moment(a.date).isBefore(moment(b.date)) ? -1 : 1, // Sort by Date & Time
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Booked", value: "Booked" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.status.includes(value),
      sorter: (a, b) => a.status.localeCompare(b.status), // Sort by status
    },
  ];

  return (
    <Layout>
      <h1>Appointments List</h1>
      {appointments.length > 0 ? (
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey={(record) => record._id} // Ensures each row has a unique key
          pagination={{ pageSize: 10 }} // Paginate the table (show 10 appointments per page)
        />
      ) : (
        <p>No appointments available.</p> // Show message when no appointments
      )}
    </Layout>
  );
};

export default Appointments;
