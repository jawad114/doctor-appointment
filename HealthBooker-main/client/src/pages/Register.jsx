import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/register.css";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

function Register() {
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confpassword: "",
    file: null,
  });
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setFormDetails({
      ...formDetails,
      file,
    });
  };

  const uploadFile = async () => {
    try {
      const { file } = formDetails;
      if (!file) {
        throw new Error("No file selected");
      }
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "btfrghs3");
      formData.append("cloud_name", "dmywr7fq0");
  
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dmywr7fq0/image/upload",
        formData
      );
      return response.data.url;
    } catch (error) {
      console.error("Error uploading file: ", error);
      throw new Error("Error uploading file: " + error.message);
    }
  };
  

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { firstname, lastname, email, password, confpassword } = formDetails;
      if (!firstname || !lastname || !email || !password || !confpassword) {
        throw new Error("Input fields should not be empty");
      } else if (firstname.length < 3) {
        throw new Error("First name must be at least 3 characters long");
      } else if (lastname.length < 3) {
        throw new Error("Last name must be at least 3 characters long");
      } else if (password.length < 5) {
        throw new Error("Password must be at least 5 characters long");
      } else if (password !== confpassword) {
        throw new Error("Passwords do not match");
      }

      const imageUrl = await uploadFile();
      await axios.post("/user/register", {
        firstname,
        lastname,
        email,
        password,
        pic: imageUrl,
      });

      toast.success("User registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign Up</h2>
        <form onSubmit={formSubmit} className="register-form">
          <input
            type="text"
            name="firstname"
            className="form-input"
            placeholder="Enter your first name"
            value={formDetails.firstname}
            onChange={inputChange}
          />
          <input
            type="text"
            name="lastname"
            className="form-input"
            placeholder="Enter your last name"
            value={formDetails.lastname}
            onChange={inputChange}
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
          />
          <input
            type="file"
            name="profile-pic"
            id="profile-pic"
            className="form-input"
            onChange={onFileChange}
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter your password"
            value={formDetails.password}
            onChange={inputChange}
          />
          <input
            type="password"
            name="confpassword"
            className="form-input"
            placeholder="Confirm your password"
            value={formDetails.confpassword}
            onChange={inputChange}
          />
          <button
            type="submit"
            className="btn form-btn"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <p>
          Already a user?{" "}
          <NavLink
            className="login-link"
            to={"/login"}
          >
            Log in
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default Register;
