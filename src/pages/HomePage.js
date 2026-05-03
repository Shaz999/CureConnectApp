import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Row, Col, message, Spin } from "antd";
import DoctorList from "../components/DoctorList";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get list of doctors
  const getUserData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/v1/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setLoading(false);

      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        message.error("Failed to fetch doctors");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Something went wrong while fetching doctors");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h1 className="text-center">Home Page</h1>

      {loading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Col key={doctor._id} span={8}>
                <DoctorList doctor={doctor} />
              </Col>
            ))
          ) : (
            <p className="text-center">No doctors available at the moment.</p>
          )}
        </Row>
      )}
    </Layout>
  );
};

export default HomePage;
