import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CalendarComponent from "react-calendar";
import "react-calendar/dist/Calendar.css";
import API from "../services/api";
import { useTheme } from "../ThemeContext";
import "./Calendar.css";

function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // ==========================================
  // FETCH ATTENDANCE
  // ==========================================

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/attendance");

      setAttendance(response.data);
    } catch (error) {
      console.log(
        "Error fetching attendance:",
        error
      );

      setError(
        "Unable to load attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (selectedDate) => {
    const year = selectedDate.getFullYear();

    const month = String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      selectedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // SELECTED DATE RECORDS
  // ==========================================

  const selectedDateString = formatDate(date);

  const selectedDateRecords =
    attendance.filter(
      (record) =>
        record.date === selectedDateString
    );

  // ==========================================
  // CALENDAR TILE CONTENT
  // ==========================================

  const getTileContent = ({ date }) => {
    const formattedDate = formatDate(date);

    const recordsForDate =
      attendance.filter(
        (record) =>
          record.date === formattedDate
      );

    if (recordsForDate.length === 0) {
      return null;
    }

    const hasPresent =
      recordsForDate.some(
        (record) =>
          record.status === "Present"
      );

    const hasAbsent =
      recordsForDate.some(
        (record) =>
          record.status === "Absent"
      );

    return (
      <div className="attendance-dots">

        {hasPresent && (
          <span
            className="attendance-dot present-dot"
            title="Present"
          ></span>
        )}

        {hasAbsent && (
          <span
            className="attendance-dot absent-dot"
            title="Absent"
          ></span>
        )}

      </div>
    );
  };

  return (
    <div className="calendar-layout">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside className="calendar-sidebar">

        {/* LOGO */}

        <div className="calendar-sidebar-logo">

          <h2>
            Attend<span>ify</span>
          </h2>

        </div>

        {/* NAVIGATION */}

        <nav className="calendar-sidebar-menu">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/attendance">
            Attendance
          </Link>

          <Link
            to="/calendar"
            className="active"
          >
            Calendar
          </Link>

          <Link to="/reports">
            Reports
          </Link>

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="calendar-sidebar-bottom">

          {/* THEME */}

          <button
            className="calendar-theme-toggle"
            onClick={toggleTheme}
          >
            {theme === "dark"
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          {/* LOGOUT */}

          <button
            className="calendar-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}

      <main className="calendar-main">

        {/* HEADER */}

        <div className="calendar-header">

          <div>
            <h1>
              Attendance Calendar
            </h1>

            <p>
              View attendance records by date
            </p>
          </div>

          <button
            className="calendar-refresh-btn"
            onClick={fetchAttendance}
          >
            ↻ Refresh
          </button>

        </div>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="calendar-error">
            {error}

            <button
              onClick={fetchAttendance}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ========================================
            LOADING
        ======================================== */}

        {loading ? (

          <div className="calendar-loading">
            <div className="calendar-spinner"></div>

            <p>
              Loading attendance records...
            </p>
          </div>

        ) : (

          <div className="calendar-container">

            {/* ======================================
                CALENDAR
            ====================================== */}

            <div className="calendar-box">

              <CalendarComponent
                onChange={setDate}
                value={date}
                tileContent={getTileContent}
              />

              {/* LEGEND */}

              <div className="calendar-legend">

                <div className="legend-item">

                  <span className="legend-dot present-dot"></span>

                  <span>
                    Present
                  </span>

                </div>

                <div className="legend-item">

                  <span className="legend-dot absent-dot"></span>

                  <span>
                    Absent
                  </span>

                </div>

              </div>

            </div>

            {/* ======================================
                SELECTED DATE
            ====================================== */}

            <div className="selected-date-box">

              <h2>
                Selected Date
              </h2>

              <p className="selected-date">
                {date.toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>

              {/* RECORD COUNT */}

              <div className="selected-date-summary">

                <span>
                  Attendance Records
                </span>

                <strong>
                  {selectedDateRecords.length}
                </strong>

              </div>

              {/* ATTENDANCE LIST */}

              <div className="attendance-list">

                {selectedDateRecords.length > 0 ? (

                  selectedDateRecords.map(
                    (record) => (

                      <div
                        className="attendance-item"
                        key={record.id}
                      >

                        <div className="attendance-item-info">

                          <h3>
                            {record.studentName}
                          </h3>

                          <p>
                            Student ID:{" "}
                            {record.studentId}
                          </p>

                          <p>
                            Course:{" "}
                            {record.course}
                          </p>

                        </div>

                        <span
                          className={
                            record.status ===
                            "Present"
                              ? "status present"
                              : "status absent"
                          }
                        >
                          {record.status}
                        </span>

                      </div>

                    )
                  )

                ) : (

                  <div className="no-attendance">

                    <div className="no-attendance-icon">
                      📅
                    </div>

                    <p>
                      No attendance records
                      for this date.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default CalendarPage;