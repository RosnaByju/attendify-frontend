import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
    <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="login" element={<Login/>}/>
            <Route path="register" element={<Register/>}/>
            <Route path="dashboard" element={<Dashboard/>}/>
           <Route path="attendance" element={<Attendance/>}/>
            <Route path="calendar" element={<Calendar/>}/>
            <Route path="reports" element={<Reports/>}/>  
    </Routes>
    </BrowserRouter>
  );
}

export default App;