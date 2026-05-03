import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  // Fetch doctor profile
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/doctor/getDoctorInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error);
      message.error("Failed to fetch doctor information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    // eslint-disable-next-line
  }, []);

  // Update doctor profile
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:5000/api/v1/doctor/updateProfile",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Something went wrong while updating.");
    } finally {
      dispatch(hideLoading());
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Manage Profile</h1>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        className="m-3"
        initialValues={{
          ...doctor,
          timings: [
            moment(doctor.timings[0], "HH:mm"),
            moment(doctor.timings[1], "HH:mm"),
          ],
        }}
      >
        <h4>Personal Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
              <Input placeholder="Your first name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input placeholder="Your last name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Phone No"
              name="phone"
              rules={[
                { required: true, message: "Please input your phone number!" },
                { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number!" },
              ]}
            >
              <Input placeholder="Your contact number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <Input placeholder="Your email address" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Website" name="website">
              <Input placeholder="Your website" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
              <Input placeholder="Your clinic address" />
            </Form.Item>
          </Col>
        </Row>

        <h4>Professional Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}>
              <Input placeholder="Your specialization" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Experience" name="experience" rules={[{ required: true }]}>
              <Input placeholder="Your experience (years)" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item
              label="Fees Per Consultation"
              name="feesPerConsultation"
              rules={[{ required: true }]}
            >
              <Input placeholder="Your fee per consultation" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Timings" name="timings" rules={[{ required: true }]}>
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}></Col>
          <Col xs={24} md={12} lg={8}>
            <button className="btn btn-primary form-btn" type="submit">
              Update
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default Profile;
