import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEventAvailable } from "react-icons/md";
import "./Login.css";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Email validation
    if (email.trim() === "") {
      setError("Email is required");
      return;
    }

    // Password validation
    if (password.trim() === "") {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      // Get users from JSON Server
      const response = await API.get("/users");

      const users = response.data;

      // Find matching user
      const user = users.find(
        (user) =>
          user.email.toLowerCase() === email.trim().toLowerCase() &&
          user.password === password
      );

      if (!user) {
        setError("Invalid email or password");
        return;
      }

      // Save logged-in user in session storage
      sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
      );

      // Login successful
      navigate("/dashboard");

    } catch (error) {
      console.log("Login error:", error);
      setError("Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <div className="logo-circle">
            <MdEventAvailable />
          </div>

          <h1>Welcome Back</h1>

          <p>
            Sign in to Student Attendance Manager
          </p>

        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Sign In
          </button>

        </form>

        <div className="register-section">

          <span>Don't have an account?</span>

          <Link to="/register">
            Create Account
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;