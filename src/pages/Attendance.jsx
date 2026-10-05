import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdEventAvailable,
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
} from "react-icons/md";

import API from "../services/api";
import { useTheme } from "../ThemeContext";
import "./Attendance.css";

function Attendance() {
  const navigate = useNavigate();

  // =============================
  // Theme
  // =============================

  const { theme, toggleTheme } = useTheme();

  // =============================
  // Attendance State
  // =============================

  const [attendance, setAttendance] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editId, setEditId] = useState(null);

  // =============================
  // Form State
  // =============================

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [totalClasses, setTotalClasses] = useState("");
  const [present, setPresent] = useState("");
  const [absent, setAbsent] = useState("");

  // =============================
  // Search & Filters
  // =============================

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // =============================
  // Pagination
  // =============================

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  // =============================
  // Fetch Attendance
  // =============================

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await API.get("/attendance");
      setAttendance(response.data);
    } catch (error) {
      console.log("Error fetching attendance:", error);
    }
  };

  // =============================
  // Add Attendance
  // =============================

  const handleAddAttendance = async () => {
    const newAttendance = {
      studentName,
      studentId,
      course,
      date,
      status,
      totalClasses: Number(totalClasses),
      present: Number(present),
      absent: Number(absent),
    };

    try {
      await API.post("/attendance", newAttendance);

      await fetchAttendance();

      setShowForm(false);

      resetForm();
    } catch (error) {
      console.log("Error adding attendance:", error);
    }
  };

  // =============================
  // Update Attendance
  // =============================

  const handleUpdateAttendance = async () => {
    const updatedAttendance = {
      studentName,
      studentId,
      course,
      date,
      status,
      totalClasses: Number(totalClasses),
      present: Number(present),
      absent: Number(absent),
    };

    try {
      await API.put(
        `/attendance/${editId}`,
        updatedAttendance
      );

      await fetchAttendance();

      setShowForm(false);

      setEditId(null);

      resetForm();
    } catch (error) {
      console.log("Error updating attendance:", error);
    }
  };

  // =============================
  // Delete Attendance
  // =============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this attendance record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/attendance/${id}`);

      await fetchAttendance();
    } catch (error) {
      console.log("Error deleting attendance:", error);
    }
  };

  // =============================
  // Edit Attendance
  // =============================

  const handleEdit = (record) => {
    setEditId(record.id);

    setStudentName(record.studentName);
    setStudentId(record.studentId);
    setCourse(record.course);
    setDate(record.date);
    setStatus(record.status);
    setTotalClasses(record.totalClasses);
    setPresent(record.present);
    setAbsent(record.absent);

    setShowForm(true);
  };

  // =============================
  // Reset Form
  // =============================

  const resetForm = () => {
    setStudentName("");
    setStudentId("");
    setCourse("");
    setDate("");
    setStatus("Present");
    setTotalClasses("");
    setPresent("");
    setAbsent("");
  };

  // =============================
  // Open Add Form
  // =============================

  const handleAddButton = () => {
    setEditId(null);

    resetForm();

    setShowForm(true);
  };

  // =============================
  // Search + Filters
  // =============================

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      record.studentName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      record.studentId
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      record.status === statusFilter;

    const matchesDate =
      dateFilter === "" ||
      record.date === dateFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDate
    );
  });

  // =============================
  // Pagination
  // =============================

  const indexOfLastRecord =
    currentPage * recordsPerPage;

  const indexOfFirstRecord =
    indexOfLastRecord - recordsPerPage;

  const currentRecords =
    filteredAttendance.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );

  const totalPages = Math.ceil(
    filteredAttendance.length / recordsPerPage
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    dateFilter,
    recordsPerPage,
  ]);

  // =============================
  // Attendance Percentage
  // =============================

  const calculatePercentage = (record) => {
    if (!record.totalClasses) {
      return 0;
    }

    return (
      (record.present / record.totalClasses) *
      100
    ).toFixed(1);
  };

  // =============================
  // Logout
  // =============================

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");

    navigate("/login");
  };

  return (
    <div className="attendance-page">

      {/* ============================= */}
      {/* Sidebar */}
      {/* ============================= */}

      <aside className="attendance-sidebar">

        <div className="attendance-logo">
          <h2>
            Attend<span>ify</span>
          </h2>
        </div>

        <nav className="attendance-menu">

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link
            to="/attendance"
            className="active"
          >
            Attendance
          </Link>

          <Link to="/calendar">
            Calendar
          </Link>

          <Link to="/reports">
            Reports
          </Link>

        </nav>

        {/* ============================= */}
        {/* Sidebar Bottom */}
        {/* ============================= */}

        <div className="attendance-sidebar-bottom">

          {/* Theme Button */}

          <button
            className="attendance-theme-toggle"
            onClick={toggleTheme}
          >
            {theme === "dark"
              ? "☀️ Light Mode"
              : "🌙 Dark Mode"}
          </button>

          {/* Logout Button */}

          <button
            className="attendance-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>


      {/* ============================= */}
      {/* Main Content */}
      {/* ============================= */}

      <main
        className="attendance-main"
        data-aos="fade-up"
      >

        {/* ============================= */}
        {/* Header */}
        {/* ============================= */}

        <div
          className="attendance-header"
          data-aos="fade-down"
        >

          <div>
            <h1>Attendance Management</h1>

            <p>
              Manage and track student attendance
            </p>
          </div>

          <button
            className="add-attendance-button"
            onClick={handleAddButton}
          >
            <MdAdd />
            Add Attendance
          </button>

        </div>


        {/* ============================= */}
        {/* Add / Edit Form */}
        {/* ============================= */}

        {showForm && (
          <div
            className="attendance-form-card"
            data-aos="fade-down"
          >

            <div className="form-header">

              <h2>
                {editId
                  ? "Edit Attendance"
                  : "Add Attendance"}
              </h2>

              <button
                className="close-form-button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  resetForm();
                }}
              >
                ×
              </button>

            </div>


            <div className="attendance-form">

              {/* Student Name */}

              <div className="form-group">

                <label>
                  Student Name
                </label>

                <input
                  type="text"
                  value={studentName}
                  onChange={(e) =>
                    setStudentName(e.target.value)
                  }
                  placeholder="Enter student name"
                />

              </div>


              {/* Student ID */}

              <div className="form-group">

                <label>
                  Student ID
                </label>

                <input
                  type="text"
                  value={studentId}
                  onChange={(e) =>
                    setStudentId(e.target.value)
                  }
                  placeholder="Enter student ID"
                />

              </div>


              {/* Course */}

              <div className="form-group">

                <label>
                  Course
                </label>

                <input
                  type="text"
                  value={course}
                  onChange={(e) =>
                    setCourse(e.target.value)
                  }
                  placeholder="Enter course"
                />

              </div>


              {/* Date */}

              <div className="form-group">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                />

              </div>


              {/* Status */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="Present">
                    Present
                  </option>

                  <option value="Absent">
                    Absent
                  </option>

                </select>

              </div>


              {/* Total Classes */}

              <div className="form-group">

                <label>
                  Total Classes
                </label>

                <input
                  type="number"
                  value={totalClasses}
                  onChange={(e) =>
                    setTotalClasses(e.target.value)
                  }
                  placeholder="Total classes"
                />

              </div>


              {/* Present */}

              <div className="form-group">

                <label>
                  Present
                </label>

                <input
                  type="number"
                  value={present}
                  onChange={(e) =>
                    setPresent(e.target.value)
                  }
                  placeholder="Present"
                />

              </div>


              {/* Absent */}

              <div className="form-group">

                <label>
                  Absent
                </label>

                <input
                  type="number"
                  value={absent}
                  onChange={(e) =>
                    setAbsent(e.target.value)
                  }
                  placeholder="Absent"
                />

              </div>

            </div>


            {/* Form Buttons */}

            <div className="form-buttons">

              <button
                className="cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  resetForm();
                }}
              >
                Cancel
              </button>

              <button
                className="save-button"
                onClick={
                  editId
                    ? handleUpdateAttendance
                    : handleAddAttendance
                }
              >
                {editId
                  ? "Update Attendance"
                  : "Save Attendance"}
              </button>

            </div>

          </div>
        )}


        {/* ============================= */}
        {/* Filters */}
        {/* ============================= */}

        <div
          className="attendance-filters"
          data-aos="fade-up"
        >

          {/* Search */}

          <div className="search-box">

            <MdSearch />

            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* Status Filter */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >

            <option value="">
              All Status
            </option>

            <option value="Present">
              Present
            </option>

            <option value="Absent">
              Absent
            </option>

          </select>


          {/* Date Filter */}

          <input
            type="date"
            className="date-filter"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(e.target.value)
            }
          />

        </div>


        {/* ============================= */}
        {/* Attendance Table */}
        {/* ============================= */}

        <div
          className="attendance-table-card"
          data-aos="fade-up"
        >

          <div className="table-header">

            <h2>
              Attendance Records
            </h2>

            <p>
              View and manage student attendance
              records
            </p>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    Student Name
                  </th>

                  <th>
                    Student ID
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Total Classes
                  </th>

                  <th>
                    Present
                  </th>

                  <th>
                    Absent
                  </th>

                  <th>
                    Percentage
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {currentRecords.length > 0 ? (

                  currentRecords.map((record) => (

                    <tr key={record.id}>

                      <td>
                        {record.studentName}
                      </td>

                      <td>
                        {record.studentId}
                      </td>

                      <td>
                        {record.course}
                      </td>

                      <td>
                        {record.date}
                      </td>

                      <td>

                        <span
                          className={
                            record.status === "Present"
                              ? "status-badge present"
                              : "status-badge absent"
                          }
                        >
                          {record.status}
                        </span>

                      </td>

                      <td>
                        {record.totalClasses}
                      </td>

                      <td>
                        {record.present}
                      </td>

                      <td>
                        {record.absent}
                      </td>

                      <td>
                        {calculatePercentage(record)}%
                      </td>

                      <td>

                        <div className="table-actions">

                          <button
                            className="edit-button"
                            onClick={() =>
                              handleEdit(record)
                            }
                            title="Edit"
                          >
                            <MdEdit />
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(record.id)
                            }
                            title="Delete"
                          >
                            <MdDelete />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="10"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                      }}
                    >
                      No attendance records found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* ============================= */}
          {/* Pagination */}
          {/* ============================= */}

          <div className="pagination">

            <div className="records-per-page">

              <span>
                Records per page:
              </span>

              <select
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(
                    Number(e.target.value)
                  );

                  setCurrentPage(1);
                }}
              >

                <option value={5}>
                  5
                </option>

                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

              </select>

            </div>


            <div className="page-buttons">

              <button
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
                disabled={currentPage === 1}
              >
                Previous
              </button>


              {Array.from(
                { length: totalPages },
                (_, index) => (

                  <button
                    key={index}
                    className={
                      currentPage === index + 1
                        ? "active-page"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(index + 1)
                    }
                  >
                    {index + 1}
                  </button>

                )
              )}


              <button
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
              >
                Next
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Attendance;