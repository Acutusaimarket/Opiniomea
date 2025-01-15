import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header";
import "./index.css";
import HeroSection from "./components/HeroSection";
import Dashboard from "./components/Dashboard";
import RegistrationForm from "./components/profileDetail";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./components/AuthContext"; // Import the AuthProvider

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div >
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route
               path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
               path="/profile"
              element={
                <ProtectedRoute>
                  <RegistrationForm />
                </ProtectedRoute>
              }
            />
            {/* Add a specific login route */}
            <Route path="/login" element={<HeroSection />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;