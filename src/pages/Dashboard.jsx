import { useEffect, useState } from "react";
import "./Dashboard.css";
import { useTheme } from "../ThemeContext";
import gsap from "gsap";

import {
  MdGroups,
  MdCheckCircle,
  MdCancel,
  MdTrendingUp,
} from "react-icons/md";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser") || "{}"
  );

  // User name
  const userName = loggedInUser?.name || "Rosna";

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  // ==========================================
  // FETCH ATTENDANCE DATA
  // ==========================================

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await API.get("/attendance");

      setAttendance(response.data);
    } catch (error) {
      console.log(
        "Error fetching attendance:",
        error
      );
    }
  };

  // ==========================================
  // TOTAL STUDENTS
  // ==========================================

  const totalStudents = attendance.length;

  // ==========================================
  // PRESENT RECORDS
  // ==========================================

  const presentToday = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  // ==========================================
  // ABSENT RECORDS
  // ==========================================

  const absentToday = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  // ==========================================
  // AVERAGE ATTENDANCE
  // ==========================================

  const averageAttendance =
    attendance.length > 0
      ? (
          attendance.reduce(
            (total, item) =>
              total +
              (Number(item.totalClasses) > 0
                ? (Number(item.present) /
                    Number(item.totalClasses)) *
                  100
                : 0),
            0
          ) / attendance.length
        ).toFixed(1)
      : 0;

  // ==========================================
  // BAR CHART DATA
  // ==========================================

  const attendanceData = attendance.map(
    (item) => ({
      date: item.date,
      present: Number(item.present),
      absent: Number(item.absent),
    })
  );

  // ==========================================
  // PIE CHART DATA
  // ==========================================

  const pieData = [
    {
      name: "Present",
      value: presentToday,
    },
    {
      name: "Absent",
      value: absentToday,
    },
  ];

  // ==========================================
  // DASHBOARD ANIMATION
  // ==========================================

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dashboard-header", {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from(".dashboard-welcome", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out",
      });

      gsap.from(".stat-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        delay: 0.3,
        ease: "power2.out",
      });

      gsap.from(".chart-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.6,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="dashboard-page">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside className="dashboard-sidebar">

        {/* LOGO */}

        <div className="sidebar-logo">
          <h2>
            Attend<span>ify</span>
          </h2>
        </div>

        {/* MENU */}

        <nav className="sidebar-menu">

          <a
            href="/dashboard"
            className="active"
          >
            Dashboard
          </a>

          <a href="/attendance">
            Attendance
          </a>

          <a href="/calendar">
            Calendar
          </a>

          <a href="/reports">
            Reports
          </a>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          {/* THEME BUTTON */}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
          >
            {theme === "dark"
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          {/* LOGOUT */}

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="dashboard-main">

        {/* ========================================
            HEADER
        ======================================== */}

        <header className="dashboard-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back! Here's your
              attendance overview.
            </p>

          </div>

          {/* PROFILE */}

          <div className="profile-area">

            <div className="profile-circle">

              {userName
                .charAt(0)
                .toUpperCase()}

            </div>

            <span>
              {userName}
            </span>

          </div>

        </header>

        {/* ========================================
            WELCOME SECTION
        ======================================== */}

        <section className="dashboard-welcome">

          <div>

            <h2>
              Good Morning, {userName}!
            </h2>

            <p>
              Keep track of your students'
              attendance and stay organized.
            </p>

          </div>

        </section>

        {/* ========================================
            STATISTICS
        ======================================== */}

        <section className="dashboard-stats">

          {/* TOTAL STUDENTS */}

          <div
            className="stat-card"
            onClick={() =>
              navigate("/attendance")
            }
          >

            <div className="stat-icon students-icon">
              <MdGroups />
            </div>

            <div className="stat-content">

              <h3>
                Total Students
              </h3>

              <p>
                {totalStudents}
              </p>

            </div>

          </div>

          {/* PRESENT */}

          <div
            className="stat-card"
            onClick={() =>
              navigate("/attendance", {
                state: {
                  status: "Present",
                },
              })
            }
          >

            <div className="stat-icon present-icon">
              <MdCheckCircle />
            </div>

            <div className="stat-content">

              <h3>
                Present Today
              </h3>

              <p>
                {presentToday}
              </p>

            </div>

          </div>

          {/* ABSENT */}

          <div
            className="stat-card"
            onClick={() =>
              navigate("/attendance", {
                state: {
                  status: "Absent",
                },
              })
            }
          >

            <div className="stat-icon absent-icon">
              <MdCancel />
            </div>

            <div className="stat-content">

              <h3>
                Absent Today
              </h3>

              <p>
                {absentToday}
              </p>

            </div>

          </div>

          {/* AVERAGE ATTENDANCE */}

          <div
            className="stat-card"
            onClick={() =>
              navigate("/reports")
            }
          >

            <div className="stat-icon attendance-icon">
              <MdTrendingUp />
            </div>

            <div className="stat-content">

              <h3>
                Average Attendance
              </h3>

              <p>
                {averageAttendance}%
              </p>

            </div>

          </div>

        </section>

        {/* ========================================
            CHARTS
        ======================================== */}

        <section className="dashboard-charts">

          {/* ======================================
              BAR CHART
          ====================================== */}

          <div className="chart-card">

            <div className="chart-header">

              <h3>
                Attendance Records
              </h3>

              <p>
                Present and absent classes
              </p>

            </div>

            <div className="chart-container">

              {attendanceData.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={attendanceData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                    />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="present"
                      name="Present"
                      fill="#14b8a6"
                    />

                    <Bar
                      dataKey="absent"
                      name="Absent"
                      fill="#ef4444"
                    />

                  </BarChart>

                </ResponsiveContainer>

              ) : (

                <p>
                  No attendance data available.
                </p>

              )}

            </div>

          </div>

          {/* ======================================
              PIE CHART
          ====================================== */}

          <div className="chart-card">

            <div className="chart-header">

              <h3>
                Attendance Overview
              </h3>

              <p>
                Overall attendance distribution
              </p>

            </div>

            <div className="chart-container">

              {presentToday + absentToday > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <PieChart>

                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      dataKey="value"
                      label
                    >

                      <Cell
                        fill="#14b8a6"
                      />

                      <Cell
                        fill="#ef4444"
                      />

                    </Pie>

                    <Tooltip />

                    <Legend />

                  </PieChart>

                </ResponsiveContainer>

              ) : (

                <p>
                  No attendance data available.
                </p>

              )}

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;