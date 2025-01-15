import React, { useState, useEffect } from "react";
import { Edit2, Save, X, UserCircle } from "lucide-react";
import "./AccountProfile.css";
import jsl from "../assets/ideal.jpg";

const AccountProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    basic: null,
    full: null,
  });
  const [editedProfile, setEditedProfile] = useState({});
  const [uiState, setUiState] = useState({
    isLoading: true,
    error: null,
    isSaving: false,
  });

  const email = localStorage.getItem("email");

  const fetchProfile = async (type = "basic") => {
    setUiState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const endpoint =
        type === "basic"
          ? `https://api.qmapi.com/api/profiles?email=${encodeURIComponent(email)}`
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
      setEditedProfile(data);
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

  const handleInputChange = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setUiState((prev) => ({ ...prev, isSaving: true, error: null }));

    try {
      const response = await fetch(`https://api.qmapi.com/api/p/profiles?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setProfileData((prev) => ({
        ...prev,
        basic: editedProfile,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setUiState((prev) => ({
        ...prev,
        error: 'Failed to update profile. Please try again.',
      }));
    } finally {
      setUiState((prev) => ({ ...prev, isSaving: false }));
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

  const profile = isEditing ? editedProfile : (profileData.basic || {});

  const renderField = (label, field) => {
    return (
      <div className="detail-item">
        <div className="detail-label">{label}</div>
        <div className="detail-value">
          {isEditing ? (
            <input
              type="text"
              value={editedProfile[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            profile[field]
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="account-profile">
      <div className="profile-header">
        <div className="profile-header-content">
          {jsl ? (
            <img src={jsl} alt="Profile" className="profile-logo" />
          ) : (
            <UserCircle size={64} className="text-gray-400" />
          )}
          <div>
            <div className="profile-name">
              {profile.firstName || "Unknown"} {profile.lastName || ""}
            </div>
            <div className="profile-email">{profile.email || email}</div>
          </div>
        </div>
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={uiState.isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                <Save size={16} />
                {uiState.isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={uiState.isSaving}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sections">
          <div className="profile-section">
            <div className="section-title">Personal Information</div>
            <div className="profile-details">
              {renderField("First Name", "firstName")}
              {renderField("Last Name", "lastName")}
              {renderField("Date of Birth", "dateOfBirth")}
              {renderField("Gender", "gender")}
            </div>
          </div>

          <div className="profile-section">
            <div className="section-title">Contact Information</div>
            <div className="profile-details">
              {renderField("Phone Number", "phoneNumber")}
            </div>
          </div>

          <div className="profile-section">
            <div className="section-title">Address Details</div>
            <div className="profile-details">
              {renderField("Street Address", "address")}
              {renderField("City", "city")}
              {renderField("State", "state")}
              {renderField("Country", "country")}
              {renderField("Postal Code", "postalCode")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;