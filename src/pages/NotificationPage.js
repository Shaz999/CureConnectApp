import React from "react";
import Layout from "./../components/Layout";
import { message, Tabs, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = React.useState(false);

  // Handle read notification
  const handleMarkAllRead = async () => {
    setLoading(true);
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/get-all-notification",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      setLoading(false);
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false);
      console.error(error);
      message.error("Something went wrong while marking notifications as read.");
    }
  };

  // Delete notifications
  const handleDeleteAllRead = async () => {
    setLoading(true);
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      setLoading(false);
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false);
      console.error(error);
      message.error("Something went wrong while deleting notifications.");
    }
  };

  return (
    <Layout>
      <h4 className="p-3 text-center">Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab="Unread" key={0}>
          <div className="d-flex justify-content-end">
            <h4 className="p-2" onClick={handleMarkAllRead}>
              {loading ? <Spin size="small" /> : "Mark All Read"}
            </h4>
          </div>
          {user?.notifcation.length > 0 ? (
            user?.notifcation.map((notificationMgs) => (
              <div key={notificationMgs._id} className="card" style={{ cursor: "pointer" }}>
                <div
                  className="card-text"
                  onClick={() => navigate(notificationMgs.onClickPath)}
                >
                  {notificationMgs.message}
                </div>
              </div>
            ))
          ) : (
            <p>No unread notifications available.</p>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key={1}>
          <div className="d-flex justify-content-end">
            <h4
              className="p-2 text-primary"
              style={{ cursor: "pointer" }}
              onClick={handleDeleteAllRead}
            >
              {loading ? <Spin size="small" /> : "Delete All Read"}
            </h4>
          </div>
          {user?.seennotification.length > 0 ? (
            user?.seennotification.map((notificationMgs) => (
              <div key={notificationMgs._id} className="card" style={{ cursor: "pointer" }}>
                <div
                  className="card-text"
                  onClick={() => navigate(notificationMgs.onClickPath)}
                >
                  {notificationMgs.message}
                </div>
              </div>
            ))
          ) : (
            <p>No read notifications available.</p>
          )}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
