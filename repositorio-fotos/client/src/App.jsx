import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MainMenu from "./components/MainMenu";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Carousel from "./components/Carousel";
import UploadImage from "./components/UploadImage";
import "./styles/App.css";

const App = () => {
  const [approvedImages, setApprovedImages] = useState([]);

  // Fetch approved images from the backend
  const fetchApprovedImages = async () => {
    try {
      const response = await fetch("http://localhost:4000/images?status=approved");
      if (!response.ok) throw new Error("Error fetching approved images.");
      const data = await response.json();
      setApprovedImages(data ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchApprovedImages();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        {/* Main Menu */}
        <Route path="/" element={<MainMenu />} />

        {/* User Upload Section */}
        <Route
          path="/upload"
          element={
            <>
              <Carousel images={approvedImages} />
              <UploadImage />
            </>
          }
        />

        {/* Admin Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
