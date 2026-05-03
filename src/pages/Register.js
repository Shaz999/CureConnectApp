import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message, Button } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // form handler
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("http://localhost:5000/api/v1/user/register", values);  // Corrected the URL
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Register Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error.response ? error.response.data : error.message);  // Detailed error logging
      message.error("Something Went Wrong");
    }
  };

  return (
    <>
      <div className="form-container">
        <Form layout="vertical" onFinish={onFinishHandler} className="register-form">
          <h3 className="text-center">Register Form</h3>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}  // AntD validation rule
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: 'email', message: 'Please enter a valid email!' }
            ]} // Email validation rule
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]} // Password validation rule
          >
            <Input.Password />
          </Form.Item>

          <Link to="/login" className="m-2">
            Already a user? Login here
          </Link>

          <Button className="btn btn-primary" type="primary" htmlType="submit">
            Register
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Register;
