import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { MdPersonAdd } from "react-icons/md";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Name validation
    if (name.trim() === "") {
      setError("Name is required");
      return;
    }

    // Email validation
    if (email.trim() === "") {
      setError("Email is required");
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      password: password
    };

    try {
      // Save user to JSON Server
      await API.post("/users", newUser);

      alert("Registration successful!");

      // Go to Login page
      navigate("/login");

    } catch (error) {
      console.log("Error registering user:", error);

      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-header">

          <div className="register-logo">
            <MdPersonAdd />
          </div>

          <h1>Create Account</h1>

          <p>
            Register for Student Attendance Manager
          </p>

        </div>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="register-form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="register-form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="register-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="register-form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="register-button"
          >
            Create Account
          </button>

        </form>

        <div className="login-section">

          <span>Already have an account?</span>

          <Link to="/login">
            Sign In
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;