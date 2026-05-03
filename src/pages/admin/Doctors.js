import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  // Fetch all doctors
  const getDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      message.error("Failed to fetch doctors");
    }
  };

  // Handle account status change (Approve / Reject)
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/admin/changeAccountStatus",
        { doctorId: record._id, userId: record.userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        setDoctors((prevDoctors) =>
          prevDoctors.map((doc) =>
            doc._id === record._id ? { ...doc, status } : doc
          )
        );
      }
    } catch (error) {
      console.error("Error updating doctor status:", error);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="d-flex gap-2">
          {record.status === "pending" ? (
            <button
              className="btn btn-success"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button
              className="btn btn-danger"
              onClick={() => handleAccountStatus(record, "rejected")}
            >
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-3">All Doctors</h1>
      <Table columns={columns} dataSource={doctors} rowKey="_id" />
    </Layout>
  );
};

export default Doctors;
