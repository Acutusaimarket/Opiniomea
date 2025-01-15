import React, { useEffect, useState } from "react";
import { Clock, Award, Target, Star, Trophy, Menu, X } from "lucide-react";
import axios from "axios";
import opineomi from "../assets/opineomi.png";
import AccountProfileForm from "./AccountProfileForm";
import AccountProfile from "./AccountProfile";
import "./Dashboard.css"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [completedSurveys, setCompletedSurveys] = useState({});
  const [showConsentPopup, setShowConsentPopup] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    dateOfBirth: "",
    gender: "",
  });

  const pointsMapping = [
    {
      min: 0,
      max: 5,
      points: 50,
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Survey",
    },
    {
      min: 6,
      max: 10,
      points: 70,
      icon: <Award className="w-6 h-6" />,
      title: "Short Survey",
    },
    {
      min: 11,
      max: 15,
      points: 100,
      icon: <Target className="w-6 h-6" />,
      title: "Standard Survey",
    },
    {
      min: 16,
      max: 20,
      points: 125,
      icon: <Star className="w-6 h-6" />,
      title: "Extended Survey",
    },
    {
      min: 21,
      max: 25,
      points: 150,
      icon: <Trophy className="w-6 h-6" />,
      title: "Premium Survey",
    },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await fetch(
          `https://api.qmapi.com/api/profiles?email=${encodeURIComponent(email)}`
        );
        if (response.ok) {
          const profileData = await response.json();
          setFormData((prev) => ({ ...prev, ...profileData }));
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleTileClick = (tile) => {
    setSelectedTile(tile);
    setShowConsentPopup(true);
  };

  const handleTileConsent = async (accepted) => {
    if (accepted && selectedTile) {
      try {
        const PID = generateRandomId();
        const email = localStorage.getItem("email");

        await axios.post(`https://api.qmapi.com/api/status/${formData.id}`, {
          PID,
          points: selectedTile.points,
          surveyType: selectedTile.title,
          timeRange: `${selectedTile.min}-${selectedTile.max}`,
        });

        window.location.href = `https://api.qmapi.com/opiniomea/entry?PNID=${PID}&SupplyID=6000&loi_min=${selectedTile.min}&loi_max=${selectedTile.max}&points=${selectedTile.points}`;
        
        console.log(`Successfully recorded points for ${selectedTile.title}`);
      } catch (error) {
        console.error("Error recording survey completion:", error);
      }
    }
    setShowConsentPopup(false);
    setSelectedTile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("email");
      const response = await fetch(
        `https://api.qmapi.com/api/p/profiles?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleContentClick = () => {
    if (isSidebarOpen && window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const renderPointsTiles = () => (
    <div className="points-tiles-container">
      {pointsMapping.map((tile, index) => (
        <div
          key={index}
          className="points-tile"
          onClick={() => handleTileClick(tile)}
        >
          <div className="points-tile-icon">{tile.icon}</div>
          <div className="points-tile-content">
            <h3 className="points-tile-title">{tile.title}</h3>
            <p className="points-tile-points">{tile.points} pts</p>
            <p className="points-tile-time">
              {tile.min}-{tile.max} mins
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="account-section">
            <AccountProfile />
          </div>
        );

      case "leaderboard":
        return (
          <div className="form-container">
            <h2 className="form-title">Profile Information</h2>
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                {Object.keys(formData)
                  .filter(
                    (field) =>
                      field !== "password" &&
                      field !== "createdAt" &&
                      field !== "updatedAt" &&
                      field !== "id"
                  )
                  .map((field) => (
                    <div className="form-group" key={field}>
                      <label htmlFor={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <input
                        type={
                          field === "email"
                            ? "email"
                            : field === "dateOfBirth"
                            ? "date"
                            : "text"
                        }
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        disabled={field === "email"}
                        className="form-input"
                        placeholder={`Enter your ${field.toLowerCase()}`}
                      />
                    </div>
                  ))}
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Save Changes
                </button>
                <button type="button" className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return <div className="survey-section">{renderPointsTiles()}</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="logo">
          <img src={opineomi} alt="Opineomi Logo" className="logo-image" />
        </div>
        <nav className="nav-menu">
          {[
            { label: "Dashboard", icon: "📋", id: "dashboard" },
            { label: "Profile", icon: "👥", id: "leaderboard" },
            { label: "Account", icon: "👤", id: "account" },
          ].map((tab) => (
            <a
              key={tab.id}
              href="#"
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(tab.id);
                if (window.innerWidth <= 768) {
                  setIsSidebarOpen(false);
                }
              }}
            >
              <span className="icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      <main className="main-content" onClick={handleContentClick}>
        {renderContent()}
      </main>

      {showConsentPopup && selectedTile && (
        <div className="consent-popup">
          <div className="consent-popup-content">
            <h3>Hi! We'd like your consent to collect your information!</h3>
            <p>
              You are about to start: <strong>{selectedTile.title}</strong>
            </p>
            <p>
              Points to earn: <strong>{selectedTile.points}</strong>
            </p>
            <p>This may include:</p>

            <div className="consent-info-grid">
              <div>
                <div className="consent-item">Cookie IDs</div>
                <div className="consent-item">Lifestyle Info</div>
                <div className="consent-item">Device Identifiers</div>
              </div>
              <div>
                <div className="consent-item">Demographics</div>
                <div className="consent-item">Interests</div>
                <div className="consent-item">Sensitive Info</div>
              </div>
            </div>

            <div className="consent-checkbox">
              <input type="checkbox" id="consent-checkbox" />
              <label htmlFor="consent-checkbox">
                I have reviewed and agree to the{" "}
                <a href="#">General Usage Terms</a>,{" "}
                <a href="#">Privacy Policy</a>, and{" "}
                <a href="#">Cookie Policy</a>
              </label>
            </div>

            <div className="consent-actions">
              <button
                onClick={() => handleTileConsent(true)}
                className="accept-button"
              >
                I Agree
              </button>
              <button
                onClick={() => handleTileConsent(false)}
                className="decline-button"
              >
                Disagree
              </button>
            </div>

            <p className="consent-footer">
              By clicking continue, you accept our terms.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;