import React, { useState, useEffect } from "react";
import "./AccountProfile.css";
import jsl from "/Users/myfantacyworld/Desktop/github/f/algo/test/high/m/frontend /opiniomea/src/assets/jsj.jpg";
// /Users/myfantacyworld/Desktop/github/f/algo/test/high/m/frontend /opiniomea/backend
const AccountProfile = () => {
  const [profileData, setProfileData] = useState({
    basic: null,
    full: null,
  });
  const [uiState, setUiState] = useState({
    isLoading: true,
    error: null,
  });

  const email = localStorage.getItem("email");

  const fetchProfile = async (type = "basic") => {
    setUiState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const endpoint =
        type === "basic"
          ? `https://api.qmapi.com/api/profiles?email=${encodeURIComponent(
              email
            )}`
          : "https://api.qmapi.com/api/profiles/";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} profile`);
      }

      const data = await response.json();
      setProfileData((prev) => ({
        ...prev,
        [type]: data,
      }));
    } catch (error) {
      console.error(`Error fetching ${type} profile:`, error);
      setUiState((prev) => ({
        ...prev,
        error: `Failed to load ${type} profile. Please try again later.`,
      }));
    } finally {
      setUiState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  useEffect(() => {
    fetchProfile("basic");
  }, []);

  if (uiState.isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <div>Loading your profile...</div>
      </div>
    );
  }

  if (uiState.error) {
    return <div className="error-state">⚠️ {uiState.error}</div>;
  }

  const basicProfile = profileData.basic || {};

  return (
    <div className="account-profile">
      <div className="profile-header">
        <div className="profile-header-content">
          <img src={jsl} alt="Profile" className="profile-logo" />
          <div>
            <div className="profile-name">
              {basicProfile.firstName || "Unknown"}{" "}
              {basicProfile.lastName || ""}
            </div>
            <div className="profile-email">{basicProfile.email || email}</div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sections">
          {/* Personal Information Section */}
          <div className="profile-section">
            <div className="section-title">Personal Information</div>
            <div className="profile-details">
              <div className="detail-item">
                <div className="detail-label">First Name</div>
                <div className="detail-value">{basicProfile.firstName}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Last Name</div>
                <div className="detail-value">{basicProfile.lastName}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Date of Birth</div>
                <div className="detail-value">{basicProfile.dateOfBirth}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Gender</div>
                <div className="detail-value">{basicProfile.gender}</div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="profile-section">
            <div className="section-title">Contact Information</div>
            <div className="profile-details">
              <div className="detail-item">
                <div className="detail-label">Phone Number</div>
                <div className="detail-value">{basicProfile.phoneNumber}</div>
              </div>
              
            </div>
          </div>

          {/* Address Section */}
          <div className="profile-section">
            <div className="section-title">Address Details</div>
            <div className="profile-details">
              <div className="detail-item">
                <div className="detail-label">Street Address</div>
                <div className="detail-value">{basicProfile.address}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">City</div>
                <div className="detail-value">{basicProfile.city}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">State</div>
                <div className="detail-value">{basicProfile.state}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Country</div>
                <div className="detail-value">{basicProfile.country}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Postal Code</div>
                <div className="detail-value">{basicProfile.postalCode}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
