import React, { useEffect, useState } from "react";
import { Clock, Award, Target, Star, Trophy, Menu, X } from "lucide-react";
import axios from "axios";
import opineomi from "../assets/opineomi.png";
import AccountProfile from "./AccountProfile";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Quick Survey",
    },
    {
      min: 6,
      max: 10,
      points: 70,
      icon: <Award className="w-6 h-6 text-white" />,
      title: "Short Survey",
    },
    {
      min: 11,
      max: 15,
      points: 100,
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Standard Survey",
    },
    {
      min: 16,
      max: 20,
      points: 125,
      icon: <Star className="w-6 h-6 text-white" />,
      title: "Extended Survey",
    },
    {
      min: 21,
      max: 25,
      points: 150,
      icon: <Trophy className="w-6 h-6 text-white" />,
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
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleTileClick = async (tile) => {
    try {
      const PID = Math.random().toString(36).substr(2, 9);
      const email = localStorage.getItem("email");

      await axios.post(`https://api.qmapi.com/api/status/${formData.id}`, {
        PID,
        points: tile.points,
        surveyType: tile.title,
        timeRange: `${tile.min}-${tile.max}`,
      });

      window.location.href = `https://api.qmapi.com/opiniomea/entry?PNID=${PID}&SupplyID=6000&loi_min=${tile.min}&loi_max=${tile.max}&points=${tile.points}&country=${"eng_us"}`;
    } catch (error) {
      console.error("Error recording survey completion:", error);
    }
  };

  const renderPointsTiles = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4 md:p-6">
      {pointsMapping.map((tile, index) => (
        <div
          key={index}
          className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
          onClick={() => handleTileClick(tile)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col space-y-4">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm w-fit">
                {tile.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {tile.title}
                </h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl md:text-4xl font-extrabold text-white">
                    {tile.points}
                  </span>
                  <span className="text-lg text-white/90">pts</span>
                </div>
                <p className="text-sm text-white/80 font-medium">
                  {tile.min}-{tile.max} mins
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <aside
  className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-100 shadow-lg transform transition-all duration-300 ease-in-out z-40
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
>
  {/* Logo Container */}
  <div className="flex items-center h-16 px-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
    <img src={opineomi} alt="Logo" className="h-8 w-auto object-contain" />
  </div>

  {/* Navigation Container */}
  <div className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
    {/* Main Navigation */}
    <nav className="flex-1 px-3 py-4">
      {[
        { label: "Dashboard", icon: "📊", id: "dashboard" },
        { label: "Account", icon: "👤", id: "account" },
      ].map((tab) => (
        <button
          key={tab.id}
          className={`w-full flex items-center px-4 py-3 mb-1 rounded-lg font-medium transition-all duration-200
            ${
              activeTab === tab.id
                ? "bg-emerald-100/80 text-emerald-700 shadow-sm"
                : "text-gray-700 hover:bg-gray-100/60"
            }
            group relative overflow-hidden`}
          onClick={() => {
            setActiveTab(tab.id);
            if (window.innerWidth <= 1024) {
              setIsSidebarOpen(false);
            }
          }}
        >
          {/* Active Indicator */}
          {activeTab === tab.id && (
            <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-emerald-500" />
          )}
          
          {/* Icon Container */}
          <span className={`flex items-center justify-center w-8 h-8 mr-3 rounded-lg 
            ${activeTab === tab.id ? 'bg-emerald-200/50' : 'bg-gray-100/50 group-hover:bg-gray-200/50'}
            transition-colors duration-200`}>
            {tab.icon}
          </span>
          
          {/* Label */}
          <span className="text-sm tracking-wide">{tab.label}</span>
        </button>
      ))}
    </nav>

    {/* Footer Section - Optional */}
    <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50/50">
      <div className="flex items-center space-x-3 px-3 py-2 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          👋
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">Welcome Back</p>
          <p className="text-xs text-gray-500">Select a survey to begin</p>
        </div>
      </div>
    </div>
  </div>
</aside>

      {/* Main Content */}
      <main
        className={`lg:ml-72 min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "blur-sm" : ""
        }`}
      >
        <div className="p-4 md:p-8">
          <header className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              {activeTab === "dashboard" ? "Available Surveys" : "Account Settings"}
            </h1>
            <p className="mt-2 text-gray-600">
              {activeTab === "dashboard"
                ? "Select a survey to start earning points"
                : "Manage your profile and preferences"}
            </p>
          </header>
          
          {activeTab === "dashboard" ? renderPointsTiles() : <AccountProfile />}
        </div>
      </main>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
