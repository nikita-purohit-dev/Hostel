import React, { useEffect, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import navUserIcon from "../assets/nav_user_icon.svg";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";
import Modal from "react-modal";
import axios from "axios";
import "./navbar.css";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid #888",
    backgroundColor: "#fefefe",
    padding: "20px",
    zIndex: "100076386245",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: "999",
  },
};

const Navbar = () => {
  const location = useLocation();
  const { user, updateUser } = useContext(UserContext);
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConPassword, setConShowPassword] = useState(false);

  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleShowConfPassword = () => {
    setConShowPassword(!showConPassword);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    parentEmail: "",
    phone: "",
    gender: "Male",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        parentEmail: user.parentEmail,
        phone: user.phone,
        gender: user.gender,
      });
    }
  }, [user]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const onChangeValue = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const userId = user.id;
      const response = await axios.put(
        "http://localhost:5111/api/user/update-profile",
        { userId, ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        const updatedUser = response.data.data.user;
        updateUser(updatedUser);

        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while updating the profile.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating the profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setFormData({
      name: "",
      email: "",
      parentEmail: "",
      phone: "",
      gender: "Male",
    });
    handleModalClose();
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      Swal.fire({
        title: "Error!",
        text: "New password and confirm password do not match.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = user.id;
      const response = await axios.put(
        "http://localhost:5111/api/user/change-password",
        {
          userId,
          currentPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        Swal.fire({
          title: "Success!",
          text: "Password updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating the password.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    handleModalClose();
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        window.location.reload();
      }
    });
  };

  if (location.pathname === "/" || location.pathname === "/adminpage") {
    return <></>;
  }
  if (
    location.pathname === "/home" ||
    location.pathname === "/services" ||
    location.pathname === "/ContactUs" ||
    location.pathname === "/about"
  ) {
    return (
      <header className="nav-bar-container">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Profile Modal"
        >
          {isChangePasswordVisible ? (
            <form className="password-form" onSubmit={handlePasswordSubmit}>
              <div style={{ marginLeft: 15 }} className="form-group">
                <label htmlFor="oldPassword">Old Password:</label>
                <div className="password-container">
                  <input
                    style={{ width: 300 }}
                    type={showOldPassword ? "text" : "password"}
                    id="oldPassword"
                    name="oldPassword"
                    value={passwords.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <span
                    type="button"
                    onClick={toggleShowOldPassword}
                    className="password-icon"
                  >
                    <i
                      style={{ marginLeft: -40 }}
                      className={showOldPassword ? "bx bx-hide" : "bx bx-show"}
                    />
                  </span>
                </div>
              </div>
              <div style={{ marginLeft: 15 }} className="form-group">
                <label htmlFor="newPassword">New Password:</label>
                <div className="password-container">
                  <input
                    style={{ width: 300 }}
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <span
                    type="button"
                    onClick={toggleShowNewPassword}
                    className="password-icon"
                  >
                    <i
                      style={{ marginLeft: -40 }}
                      className={showNewPassword ? "bx bx-hide" : "bx bx-show"}
                    />
                  </span>
                </div>
              </div>
              <div style={{ marginLeft: 15 }} className="form-group">
                <label htmlFor="confirmNewPassword">
                  Confirm New Password:
                </label>
                <div className="password-container">
                  <input
                    style={{ width: 300 }}
                    type={showConPassword ? "text" : "password"}
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={passwords.confirmNewPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <span
                    type="button"
                    onClick={toggleShowConfPassword}
                    className="password-icon"
                  >
                    <i
                      style={{ marginLeft: -40 }}
                      className={showConPassword ? "bx bx-hide" : "bx bx-show"}
                    />
                  </span>
                </div>
              </div>
              <button
                style={{ marginLeft: 10 }}
                type="submit"
                className="btn-submit"
              >
                Update Password
              </button>
            </form>
          ) : (
            <div className="profile-form-div">
              <form className="profile-form" onSubmit={handleSubmitForm}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onChangeValue}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onChangeValue}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="parentEmail">Parent Email:</label>
                  <input
                    type="email"
                    id="parentEmail"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={onChangeValue}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Mobile:</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={onChangeValue}
                    required
                  />
                </div>
                <div className="sign-up-gender">
                  <label htmlFor="sign-up-gender">Gender</label>
                  <select
                    name="gender"
                    id="sign-up-gender"
                    onChange={onChangeValue}
                    value={formData.gender}
                    required
                  >
                    <option value="Male">Boy</option>
                    <option value="Female">Girl</option>
                  </select>
                </div>
                <button type="submit" className="btn-submit">
                  Update Profile
                </button>
              </form>
            </div>
          )}
          <span
            style={{ marginLeft: 15 }}
            onClick={() => setIsChangePasswordVisible(!isChangePasswordVisible)}
            className="btn-toggle"
          >
            {isChangePasswordVisible ? "Update Profile ?" : "Change Password ?"}
          </span>
        </Modal>
        <nav className="nav-bar">
          <Link className="logo " to="/home">
            {/* <span style={{ color: "#000" }}>HMS</span> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xmlns:svgjs="http://svgjs.dev/svgjs"
              width="120"
              height="60"
              viewBox="0 0 2000 1252"
            >
              <g transform="matrix(1,0,0,1,-1.2121212121212466,-2.01935483870966)">
                <svg
                  viewBox="0 0 396 248"
                  data-background-color="#ffffff"
                  preserveAspectRatio="xMidYMid meet"
                  height="1252"
                  width="2000"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <g
                    id="tight-bounds"
                    transform="matrix(1,0,0,1,0.2400000000000091,0.4000000000000057)"
                  >
                    <svg
                      viewBox="0 0 395.52 247.2"
                      height="247.2"
                      width="395.52"
                    >
                      <g>
                        <svg></svg>
                      </g>
                      <g>
                        <svg
                          viewBox="0 0 395.52 247.2"
                          height="247.2"
                          width="395.52"
                        >
                          <g transform="matrix(1,0,0,1,75.54432,65.66812475045829)">
                            <svg
                              viewBox="0 0 244.43135999999998 115.86375049908341"
                              height="115.86375049908341"
                              width="244.43135999999998"
                            >
                              <g>
                                <svg
                                  viewBox="0 0 244.43135999999998 115.86375049908341"
                                  height="115.86375049908341"
                                  width="244.43135999999998"
                                >
                                  <g>
                                    <svg
                                      viewBox="0 0 244.43135999999998 115.86375049908341"
                                      height="115.86375049908341"
                                      width="244.43135999999998"
                                    >
                                      <g id="textblocktransform">
                                        <svg
                                          viewBox="0 0 244.43135999999998 115.86375049908341"
                                          height="115.86375049908341"
                                          width="244.43135999999998"
                                          id="textblock"
                                        >
                                          <g>
                                            <svg
                                              viewBox="0 0 244.43135999999998 77.47975675348273"
                                              height="77.47975675348273"
                                              width="244.43135999999998"
                                            >
                                              <g transform="matrix(1,0,0,1,0,0)">
                                                <svg
                                                  width="244.43135999999998"
                                                  viewBox="1.34 -37.84 120.92 38.330000000000005"
                                                  height="77.47975675348273"
                                                  data-palette-color="#00406e"
                                                >
                                                  <path
                                                    d="M1.34 0L1.34-1.9 5.15-1.9 5.18-35.45 1.34-35.45 1.34-37.35 15.87-37.35 15.87-35.45 11.74-35.45 11.74-19.68 29.91-19.68 29.93-35.45 25.81-35.45 25.81-37.35 40.33-37.35 40.33-35.45 36.5-35.45 36.5-1.9 40.31-1.9 40.31 0 25.81 0 25.81-1.9 29.91-1.9 29.91-17.77 11.74-17.77 11.74-1.9 15.84-1.9 15.84 0 1.34 0ZM43.19 0L43.19-1.9 47.68-1.9 47.68-35.45 43.14-35.45 43.14-37.35 55.88-37.35 66.89-10.18 77.83-37.35 90.16-37.35 90.16-35.45 85.4-35.45 85.4-1.9 90.6-1.9 90.6 0 74.36 0 74.36-1.9 78.81-1.9 78.83-34.4 65.26-0.51 64.28-0.51 49.9-34.57 49.9-1.9 54.32-1.9 54.32 0 43.19 0ZM99.19-2.83L99.19-2.83Q98.19-1.71 98.19 0L98.19 0 96.02 0 96.02-9.96 98.53-9.96Q99.48-6.2 102.5-3.87 105.51-1.54 109.79-1.54L109.79-1.54Q115.13-1.54 116.94-4.49L116.94-4.49Q117.52-5.49 117.52-6.74L117.52-6.74Q117.52-9.4 115.64-11.3 113.76-13.21 109.21-14.88 104.66-16.55 102.33-17.94 100-19.34 98.65-20.87L98.65-20.87Q96.28-23.58 96.28-27.98 96.28-32.37 100.06-35.11 103.83-37.84 109.22-37.84L109.22-37.84Q112.28-37.84 114.41-37.13 116.55-36.43 117.67-35.47L117.67-35.47Q118.26-36.33 118.31-37.35L118.31-37.35 120.58-37.35 120.58-28.27 118.23-28.27Q117.87-31.88 115.22-33.85 112.57-35.82 109.09-35.82 105.61-35.82 103.41-34.39 101.22-32.96 101.22-30.49 101.22-28.03 103.27-26.17 105.32-24.32 111.64-21.53L111.64-21.53Q117.57-19.12 119.92-16.64 122.26-14.16 122.26-10.52L122.26-10.52Q122.26-5.4 118.66-2.45 115.06 0.49 109.94 0.49 104.83 0.49 101.04-1.56L101.04-1.56Q99.92-2.17 99.19-2.83Z"
                                                    opacity="1"
                                                    transform="matrix(1,0,0,1,0,0)"
                                                    fill="#000000"
                                                    class="wordmark-text-0"
                                                    data-fill-palette-color="primary"
                                                    id="text-0"
                                                  ></path>
                                                </svg>
                                              </g>
                                            </svg>
                                          </g>
                                          <g transform="matrix(1,0,0,1,0,95.77086780881793)">
                                            <svg
                                              viewBox="0 0 244.43135999999998 20.092882690265483"
                                              height="20.092882690265483"
                                              width="244.43135999999998"
                                            >
                                              <g transform="matrix(1,0,0,1,0,0)">
                                                <svg
                                                  width="244.43135999999998"
                                                  viewBox="1.34 -37.35 620.6899999999999 51.02"
                                                  height="20.092882690265483"
                                                  data-palette-color="#4b7488"
                                                >
                                                  <path
                                                    d="M1.34 0L1.34-1.9 5.15-1.9 5.18-35.45 1.34-35.45 1.34-37.35 15.87-37.35 15.87-35.45 11.74-35.45 11.74-19.68 29.91-19.68 29.93-35.45 25.81-35.45 25.81-37.35 40.33-37.35 40.33-35.45 36.5-35.45 36.5-1.9 40.31-1.9 40.31 0 25.81 0 25.81-1.9 29.91-1.9 29.91-17.77 11.74-17.77 11.74-1.9 15.84-1.9 15.84 0 1.34 0ZM43.43-12.5Q43.43-18.26 47.09-21.83 50.75-25.39 56.31-25.39 61.86-25.39 65.46-21.84 69.06-18.29 69.06-12.51 69.06-6.74 65.49-3.13 61.91 0.49 56.32 0.49 50.73 0.49 47.08-3.13 43.43-6.74 43.43-12.5ZM56.25-1.54L56.25-1.54Q61.18-1.54 62.03-8.25L62.03-8.25Q62.28-10.25 62.28-12.55L62.28-12.55Q62.28-17.7 61.11-20.26L61.11-20.26Q59.67-23.34 56.25-23.34L56.25-23.34Q51.32-23.34 50.46-16.85L50.46-16.85Q50.22-14.87 50.22-12.55L50.22-12.55Q50.22-7.37 51.39-4.74L51.39-4.74Q52.85-1.54 56.25-1.54ZM89.18-23.05L89.18-23.05Q85.42-23.05 82.59-19.7L82.59-19.7 82.59-1.9 86.57-1.9 86.57 0 72.29 0 72.29-1.9 76.24-1.9 76.24-23.12 72.26-23.12 72.26-24.98 82.59-24.98 82.59-22.19Q86.08-25.39 90.14-25.39 94.21-25.39 96.77-23.17L96.77-23.17Q97.7-22.36 98.31-21.17L98.31-21.17Q102.17-25.39 107.08-25.39L107.08-25.39Q110.32-25.39 112.86-23.73L112.86-23.73Q116.08-21.58 116.08-16.89L116.08-16.89 116.08-1.9 120.06-1.9 120.06 0 105.54 0 105.54-1.9 109.74-1.9 109.74-17.63Q109.74-20.29 109.1-21.29 108.47-22.29 107.72-22.67 106.98-23.05 105.88-23.05L105.88-23.05Q103.75-23.05 101.97-21.97 100.19-20.9 99.02-19.12L99.02-19.12Q99.19-18.09 99.19-17.24L99.19-17.24 99.19-1.9 103.17-1.9 103.17 0 88.89 0 88.89-1.9 92.84-1.9 92.84-17.8Q92.84-20.36 92.28-21.33 91.72-22.29 91-22.67 90.28-23.05 89.18-23.05ZM145.55-5.44L146.84-4.27Q143.01 0.49 135.93 0.49L135.93 0.49Q133.59 0.49 131.05-0.5 128.51-1.49 126.73-3.22L126.73-3.22Q123.04-6.88 123.04-12.56 123.04-18.24 126.75-21.8 130.46-25.37 136.17-25.37L136.17-25.37Q144.57-25.37 146.75-18.33L146.75-18.33Q147.45-16.09 147.45-13.28L147.45-13.28 129.78-13.28 129.78-12.55Q129.78-5 134.05-2.64L134.05-2.64Q135.49-1.83 137.49-1.83L137.49-1.83Q141.94-1.83 145.55-5.44L145.55-5.44ZM129.9-15.28L140.89-15.28Q140.84-19.19 139.69-21.25 138.54-23.32 135.93-23.32L135.93-23.32Q130.63-23.32 129.9-15.28L129.9-15.28ZM166.98 0L166.98-1.9 169.62-1.9 183.39-37.35 186.22-37.35 200.94-1.9 203.43-1.9 203.43 0 190.12 0 190.12-1.9 193.79-1.9 190.27-10.42 175.45-10.42 172.23-1.9 176.62-1.9 176.62 0 166.98 0ZM176.18-12.33L189.49-12.33 182.56-29.2 176.18-12.33ZM216.24 0.49L205.6-23.07 203.92-23.07 203.92-24.98 215.44-24.98 215.44-23.07 212.51-23.07 219.27-7.69 226.21-24.98 227.91-24.98 235.68-7.74 241.49-23.07 237.92-23.07 237.92-24.98 246.37-24.98 246.37-23.07 243.66-23.07 234.75 0.49 232.8 0.49 224.96-16.43 218.17 0.49 216.24 0.49ZM264.24-2.76L264.24-2.76Q261.41 0.49 256.65 0.49L256.65 0.49Q253.03 0.49 250.42-1.53 247.81-3.54 247.81-6.8 247.81-10.06 250.37-11.93 252.94-13.79 256.98-13.79 261.02-13.79 263.73-11.77L263.73-11.77 263.73-17.58Q263.73-20.53 263-21.58 262.26-22.63 261.27-23.05 260.29-23.46 259.09-23.46L259.09-23.46Q257.21-23.46 255.92-23.03 254.62-22.61 254.18-22.17L254.18-22.17Q255.3-21.83 255.92-20.46L255.92-20.46Q256.11-19.97 256.11-19.29L256.11-19.29Q256.11-17.94 255.13-17.05 254.16-16.16 253.18-16.16L253.18-16.16Q251.47-16.16 250.52-17.07 249.57-17.97 249.57-19.24 249.57-20.51 250.03-21.33 250.5-22.14 251.28-22.8L251.28-22.8Q252.77-24.05 255.02-24.71 257.28-25.37 259.26-25.37L259.26-25.37Q264.75-25.37 267.39-23.14 270.03-20.92 270.03-16.94L270.03-16.94 270.03-3.93Q270.03-1.9 271.03-1.9 272.03-1.9 272.96-3.13L272.96-3.13 274.23-2.08Q272.57 0.44 268.81 0.44L268.81 0.44Q267.49 0.44 266.13-0.39 264.78-1.22 264.24-2.76ZM263.8-4.71L263.8-9.59Q261.73-11.62 259.26-11.62 256.79-11.62 255.55-10.46 254.3-9.3 254.3-6.74L254.3-6.74Q254.3-2.95 256.96-2.15L256.96-2.15Q257.72-1.9 258.5-1.9L258.5-1.9Q260.72-1.9 262.75-3.61L262.75-3.61Q263.34-4.13 263.8-4.71L263.8-4.71ZM277.02 7.85Q277.67 7.18 278.26 6.92 278.86 6.67 280 6.67 281.13 6.67 281.95 7.53 282.77 8.4 282.77 9.42 282.77 10.45 282.16 11.28L282.16 11.28Q283.09 11.13 284.04 9.85 284.99 8.57 286.28 5.91L286.28 5.91 288.53 0.49 277.25-23.07 274.64-23.07 274.64-24.98 287.8-24.98 287.8-23.07 284.4-23.07 291.78-6.32 298.37-23.07 294.1-23.07 294.1-24.98 303.25-24.98 303.25-23.07 300.76-23.07 291.09 0.49 288.14 7.13Q286.41 10.57 285.2 11.72 283.99 12.87 283.01 13.27 282.04 13.67 280.99 13.67L280.99 13.67Q279.01 13.67 277.69 12.59 276.37 11.5 276.37 10.01 276.37 8.52 277.02 7.85ZM321.85 0L321.85-1.9 326.71-1.9 326.73-35.45 321.83-35.45 321.83-37.35 352.42-37.35 352.42-26.59 350.51-26.59Q350.24-31.18 349.02-32.91L349.02-32.91Q347.41-35.23 342.99-35.45L342.99-35.45 333.3-35.45 333.3-19.41 338.57-19.41Q340.62-19.41 341.86-20.09 343.09-20.78 343.33-22.44L343.33-22.44Q343.38-22.92 343.42-23.55 343.46-24.17 343.51-24.71L343.51-24.71 345.51-24.71 345.51-11.94 343.51-11.94Q343.46-12.5 343.42-13.24 343.38-13.99 343.33-14.48L343.33-14.48Q342.89-17.5 338.57-17.5L338.57-17.5 333.3-17.5 333.3-1.9 341.21-1.9 341.21 0 321.85 0ZM366.09-24.98L366.09-21.61Q370.02-25.39 374.58-25.39L374.58-25.39Q376.05-25.39 377.17-24.41 378.29-23.44 378.29-21.91 378.29-20.39 377.34-19.43 376.39-18.48 375.02-18.48L375.02-18.48Q373.65-18.48 372.71-19.42 371.77-20.36 371.77-21.75L371.77-21.75Q371.77-22.31 371.97-22.9L371.97-22.9Q368.43-21.83 366.09-19.26L366.09-19.26 366.09-1.88 371.43-1.88 371.43 0 356.05 0 356.05-1.88 359.69-1.88 359.69-23.07 356.03-23.07 356.03-24.98 366.09-24.98ZM380.68-12.5Q380.68-18.26 384.35-21.83 388.01-25.39 393.56-25.39 399.12-25.39 402.72-21.84 406.32-18.29 406.32-12.51 406.32-6.74 402.74-3.13 399.16 0.49 393.57 0.49 387.98 0.49 384.33-3.13 380.68-6.74 380.68-12.5ZM393.5-1.54L393.5-1.54Q398.43-1.54 399.29-8.25L399.29-8.25Q399.53-10.25 399.53-12.55L399.53-12.55Q399.53-17.7 398.36-20.26L398.36-20.26Q396.92-23.34 393.5-23.34L393.5-23.34Q388.57-23.34 387.71-16.85L387.71-16.85Q387.47-14.87 387.47-12.55L387.47-12.55Q387.47-7.37 388.64-4.74L388.64-4.74Q390.11-1.54 393.5-1.54ZM426.43-23.05L426.43-23.05Q422.67-23.05 419.84-19.7L419.84-19.7 419.84-1.9 423.82-1.9 423.82 0 409.54 0 409.54-1.9 413.49-1.9 413.49-23.12 409.51-23.12 409.51-24.98 419.84-24.98 419.84-22.19Q423.33-25.39 427.4-25.39 431.46-25.39 434.03-23.17L434.03-23.17Q434.95-22.36 435.56-21.17L435.56-21.17Q439.42-25.39 444.33-25.39L444.33-25.39Q447.57-25.39 450.11-23.73L450.11-23.73Q453.34-21.58 453.34-16.89L453.34-16.89 453.34-1.9 457.32-1.9 457.32 0 442.79 0 442.79-1.9 446.99-1.9 446.99-17.63Q446.99-20.29 446.35-21.29 445.72-22.29 444.97-22.67 444.23-23.05 443.13-23.05L443.13-23.05Q441.01-23.05 439.23-21.97 437.44-20.9 436.27-19.12L436.27-19.12Q436.44-18.09 436.44-17.24L436.44-17.24 436.44-1.9 440.42-1.9 440.42 0 426.14 0 426.14-1.9 430.09-1.9 430.09-17.8Q430.09-20.36 429.53-21.33 428.97-22.29 428.25-22.67 427.53-23.05 426.43-23.05ZM475.91 0L475.91-1.9 479.72-1.9 479.75-35.45 475.91-35.45 475.91-37.35 490.44-37.35 490.44-35.45 486.32-35.45 486.32-19.68 504.48-19.68 504.5-35.45 500.38-35.45 500.38-37.35 514.9-37.35 514.9-35.45 511.07-35.45 511.07-1.9 514.88-1.9 514.88 0 500.38 0 500.38-1.9 504.48-1.9 504.48-17.77 486.32-17.77 486.32-1.9 490.42-1.9 490.42 0 475.91 0ZM518-12.5Q518-18.26 521.66-21.83 525.33-25.39 530.88-25.39 536.43-25.39 540.04-21.84 543.64-18.29 543.64-12.51 543.64-6.74 540.06-3.13 536.48 0.49 530.89 0.49 525.3 0.49 521.65-3.13 518-6.74 518-12.5ZM530.82-1.54L530.82-1.54Q535.75-1.54 536.61-8.25L536.61-8.25Q536.85-10.25 536.85-12.55L536.85-12.55Q536.85-17.7 535.68-20.26L535.68-20.26Q534.24-23.34 530.82-23.34L530.82-23.34Q525.89-23.34 525.03-16.85L525.03-16.85Q524.79-14.87 524.79-12.55L524.79-12.55Q524.79-7.37 525.96-4.74L525.96-4.74Q527.43-1.54 530.82-1.54ZM563.75-23.05L563.75-23.05Q559.99-23.05 557.16-19.7L557.16-19.7 557.16-1.9 561.14-1.9 561.14 0 546.86 0 546.86-1.9 550.81-1.9 550.81-23.12 546.83-23.12 546.83-24.98 557.16-24.98 557.16-22.19Q560.65-25.39 564.72-25.39 568.78-25.39 571.34-23.17L571.34-23.17Q572.27-22.36 572.88-21.17L572.88-21.17Q576.74-25.39 581.65-25.39L581.65-25.39Q584.89-25.39 587.43-23.73L587.43-23.73Q590.66-21.58 590.66-16.89L590.66-16.89 590.66-1.9 594.64-1.9 594.64 0 580.11 0 580.11-1.9 584.31-1.9 584.31-17.63Q584.31-20.29 583.67-21.29 583.04-22.29 582.29-22.67 581.55-23.05 580.45-23.05L580.45-23.05Q578.33-23.05 576.54-21.97 574.76-20.9 573.59-19.12L573.59-19.12Q573.76-18.09 573.76-17.24L573.76-17.24 573.76-1.9 577.74-1.9 577.74 0 563.46 0 563.46-1.9 567.41-1.9 567.41-17.8Q567.41-20.36 566.85-21.33 566.29-22.29 565.57-22.67 564.85-23.05 563.75-23.05ZM620.12-5.44L621.41-4.27Q617.58 0.49 610.5 0.49L610.5 0.49Q608.16 0.49 605.62-0.5 603.08-1.49 601.3-3.22L601.3-3.22Q597.61-6.88 597.61-12.56 597.61-18.24 601.32-21.8 605.03-25.37 610.75-25.37L610.75-25.37Q619.14-25.37 621.32-18.33L621.32-18.33Q622.03-16.09 622.03-13.28L622.03-13.28 604.35-13.28 604.35-12.55Q604.35-5 608.62-2.64L608.62-2.64Q610.06-1.83 612.06-1.83L612.06-1.83Q616.51-1.83 620.12-5.44L620.12-5.44ZM604.47-15.28L615.46-15.28Q615.41-19.19 614.26-21.25 613.11-23.32 610.5-23.32L610.5-23.32Q605.2-23.32 604.47-15.28L604.47-15.28Z"
                                                    opacity="1"
                                                    transform="matrix(1,0,0,1,0,0)"
                                                    fill="#000000"
                                                    class="slogan-text-1"
                                                    data-fill-palette-color="secondary"
                                                    id="text-1"
                                                  ></path>
                                                </svg>
                                              </g>
                                            </svg>
                                          </g>
                                        </svg>
                                      </g>
                                    </svg>
                                  </g>
                                </svg>
                              </g>
                            </svg>
                          </g>
                          <g>
                            <path
                              d="M0 123.6c0-68.262 55.338-123.6 123.6-123.6 43.535 0 81.814 22.508 103.833 56.523h-4.188c-21.577-31.991-58.154-53.029-99.645-53.029-66.333 0-120.106 53.773-120.106 120.106 0 66.333 53.773 120.106 120.106 120.106 41.491 0 78.067-21.038 99.645-53.029l4.188 0c-22.019 34.014-60.297 56.523-103.833 56.523-68.262 0-123.6-55.338-123.6-123.6z"
                              fill="#000000"
                              stroke="transparent"
                              data-fill-palette-color="tertiary"
                            ></path>
                          </g>
                        </svg>
                      </g>
                      <defs></defs>
                    </svg>
                    <rect
                      width="395.52"
                      height="247.2"
                      fill="none"
                      stroke="none"
                      visibility="hidden"
                    ></rect>
                  </g>
                </svg>
              </g>
            </svg>
          </Link>
          <ul className="links">
            <li>
              <Link to="/services">Services</Link>
            </li>
            <li>
              <Link to="/ContactUs">Contact Us</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
          <div className="user-actions">
            <div onClick={handleModalOpen} className="profile">
              <span className="profile-name">{user?.name}</span>
              <img
                height={30}
                width={30}
                src={navUserIcon}
                alt="Account Icon"
              />
            </div>
            <button
              style={{ marginTop: 10 }}
              onClick={handleLogout}
              type="button"
              className="logout-button"
            >
              <span>Logout</span>

              <svg
                className="logout-img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
            </button>
          </div>
        </nav>
      </header>
    );
  } else {
    return <></>;
  }
};

export default Navbar;
