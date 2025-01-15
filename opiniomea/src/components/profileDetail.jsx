// ProfileAPIHandler.js
import axios from 'axios';

class ProfileAPIHandler {
  constructor() {
    this.baseURL = `https://api.qmapi.com/api/p/profiles?email=${localStorage.getItem('email')}`;
  }

  async createProfile(userData) {
    try {
      const response = await axios.post(this.baseURL, this.formatUserData(userData), {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      if (error.response) throw new Error(`Server error: ${error.response.data.message || error.message}`);
      if (error.request) throw new Error('Network error: Please check your connection');
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  }

  formatUserData(userData) {
    return {
      email: localStorage.getItem("email"),
      firstName: userData.firstName?.trim(),
      lastName: userData.lastName?.trim(),
      phoneNumber: userData.phoneNumber?.trim(),
      address: userData.address?.trim(),
      city: userData.city?.trim(),
      state: userData.state?.trim(),
      country: userData.country?.trim(),
      postalCode: userData.postalCode?.trim(),
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      point: 0
    };
  }
}

// FormField.js
import { AlertCircle } from "lucide-react";

const FormField = ({ name, label, type = "text", value, onChange, error, disabled = false }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {label !== "Address Line 1" && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-lg border ${
        error ? "border-red-500 bg-red-50" : "border-gray-300"
      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        disabled ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />
    {error && (
      <p className="text-red-500 text-sm flex items-center">
        <AlertCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

// ProgressSteps.js
import React from 'react';
import { Check } from "lucide-react";

const ProgressSteps = ({ currentStep }) => (
  <div className="flex justify-center items-center space-x-4 mt-6">
    {[1, 2].map((step) => (
      <div key={step} className={`flex items-center ${step !== 2 && "flex-1"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          currentStep >= step ? "bg-white text-emerald-600" : "bg-emerald-400 text-white"
        }`}>
          {currentStep > step ? <Check className="w-5 h-5" /> : step}
        </div>
        {step === 1 && (
          <div className="flex-1 h-1 mx-4 bg-emerald-400">
            <div className={`h-full bg-white transition-all duration-500 ${
              currentStep > 1 ? "w-full" : "w-0"
            }`} />
          </div>
        )}
      </div>
    ))}
  </div>
);

// RegistrationForm.js
import { useState, useCallback } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "Male",
    dateOfBirth: "",
    phoneNumber: "",
    postalCode: "",
    address: "",
    country: "India",
    state: "",
    city: "",
  });

  const navigate = useNavigate();
  const apiHandler = new ProfileAPIHandler();

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phoneNumber?.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) newErrors.phoneNumber = "Enter valid 10-digit number";
    
    if (currentStep === 2) {
      if (!formData.postalCode?.trim()) newErrors.postalCode = "Postal code is required";
      else if (!/^\d{6}$/.test(formData.postalCode.trim())) newErrors.postalCode = "Enter valid 6-digit code";
      if (!formData.state?.trim()) newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, currentStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      const res = await apiHandler.createProfile(formData);
      setSubmitStatus({
        type: "success",
        message: "Registration successful! Welcome aboard.",
      });
      navigate('/dashboard');
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const handleNextStep = useCallback(() => {
    if (validateForm()) setCurrentStep(2);
  }, [validateForm]);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-green-100 to-green-60 px-8 py-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Complete Registration</h2>
            <p className="mt-2 text-gray-600">Join our community</p>
          </div>

          <ProgressSteps currentStep={currentStep} />

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={(value) => handleInputChange("firstName", value)}
                    error={errors.firstName}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(value) => handleInputChange("lastName", value)}
                    error={errors.lastName}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="phoneNumber"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(value) => handleInputChange("phoneNumber", value)}
                    error={errors.phoneNumber}
                    type="tel"
                    disabled={isSubmitting}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    name="postalCode"
                    label="Postal Code"
                    value={formData.postalCode}
                    onChange={(value) => handleInputChange("postalCode", value)}
                    error={errors.postalCode}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="state"
                    label="State"
                    value={formData.state}
                    onChange={(value) => handleInputChange("state", value)}
                    error={errors.state}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={(value) => handleInputChange("city", value)}
                    error={errors.city}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(value) => handleInputChange("dateOfBirth", value)}
                    disabled={isSubmitting}
                  />
                  <FormField
                    name="address"
                    label="Address Line 1"
                    value={formData.address}
                    onChange={(value) => handleInputChange("address", value)}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="flex justify-center space-x-4 pt-6">
                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 flex items-center space-x-2 disabled:opacity-50"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          <Dialog
            open={!!submitStatus.message}
            onClose={() => setSubmitStatus({ type: "", message: "" })}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen">
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
              <div className="relative bg-white rounded-lg p-6 max-w-md mx-auto">
                <div className={`${
                  submitStatus.type === "success" ? "text-green-600" : "text-red-600"
                } flex items-center space-x-2`}>
                  {submitStatus.type === "success" ? "✓" : "⚠"} {submitStatus.message}
                </div>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;