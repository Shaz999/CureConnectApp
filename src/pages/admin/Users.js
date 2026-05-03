import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, message } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users
  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to fetch users");
    }
  };

  // Handle user block/unblock
  const handleBlockUser = async (record) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/admin/blockUser",
        { userId: record._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === record._id ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Ant Design table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="d-flex">
          <button
            className={`btn ${record.isBlocked ? "btn-success" : "btn-danger"}`}
            onClick={() => handleBlockUser(record)}
          >
            {record.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-2">Users List</h1>
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </Layout>
  );
};

export default Users;
