import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  AlertCircle,
  Gift,
  ChevronRight,
  CheckCircle2,
  Star,
  DollarSign,
  Users,
  TrendingUp,
} from "lucide-react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useAuth } from "./AuthContext";
import earn from "../assets/earn.png";
import survey from "../assets/survey.png";
import openiomea from "../assets/opineomi.png";
import step1 from "../assets/step1.svg";
import step2 from "../assets/step2.svg";
import step3 from "../assets/step3.svg";
import soc from "../assets/image.png";
import Header from "./header";
import target from "../assets/target.png";
import walmart from "../assets/walmart.png";
import buy from "../assets/buy.png";
import buck from "../assets/bucks.png";
import nike from "../assets/nike.png";
import person from "../assets/person.png";
import person1 from "../assets/person1.png";
import person2 from "../assets/person2.png";
import { Navigate, useNavigate } from "react-router-dom";
// Importing images (using placeholder API for demo)
const IMAGES = {
  logo: openiomea,
  hero: "/api/placeholder/600/400",
  step1: step1,
  step2: step2,
  step3: step3,
  testimonial1: person,
  testimonial2: person1,
  testimonial3: person2,
  brands: {
    amazon: soc,
    target: target,
    walmart: walmart,
    bestBuy: buy,
    starbucks: buck,
    nike: nike,
  },
};

const HeroSection = () => {
  const [email, setEmail] = useState("");
  const Navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: "50,000+",
    totalEarned: "$1.2M+",
    activeSurveys: "500+",
    avgEarnings: "$100",
  });
  const [consents, setConsents] = useState({
    cookies: false,
    privacy: false,
    terms: false,
  });

  const handleConsentChange = (field) => (e) => {
    setConsents((prev) => ({
      ...prev,
      [field]: e.target.checked,
    }));
  };

  const handleInputChange = (setter) => (e) => setter(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate consents for new registrations
    if (
      !isLogin &&
      (!consents.cookies || !consents.privacy || !consents.terms)
    ) {
      setError("Please accept all required terms to continue");
      return;
    }

    try {
      if (!email.includes("@") || password.length < 6) {
        throw new Error(
          "Please enter a valid email and password (min 6 characters)"
        );
      }

      const endpoint = isLogin ? "login" : "register";
      const response = await fetch(`https://api.qmapi.com/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          consents: !isLogin ? consents : undefined, // Only send consents for registration
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication failed");
      }

      const data = await response.json();

      // Store the token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);

      // Store consent preferences if registering
      if (!isLogin) {
        localStorage.setItem("userConsents", JSON.stringify(consents));
      }

      Navigate("/profile");
    } catch (err) {
      setError(err.message);
      console.error("Auth error:", err);
    }
  };

  const features = [
    {
      icon: <DollarSign size={24} className="text-green-600" />,
      text: "Earn up to $100 per month",
      description: "Complete surveys and receive competitive compensation",
    },
    {
      icon: <Users size={24} className="text-green-600" />,
      text: "Join 50,000+ members",
      description: "Be part of our growing community of survey takers",
    },
    {
      icon: <Star size={24} className="text-green-600" />,
      text: "Premium survey opportunities",
      description: "Access high-paying surveys from top brands",
    },
    {
      icon: <TrendingUp size={24} className="text-green-600" />,
      text: "Regular rewards",
      description: "Cash out your earnings weekly or monthly",
    },
  ];

  const rewards = [
    {
      name: "Amazon",
      value: "$25",
      color: "bg-blue-500",
      popular: true,
      image: IMAGES.brands.amazon,
      minPoints: 2500,
    },
    {
      name: "Target",
      value: "$50",
      color: "bg-red-500",
      image: IMAGES.brands.target,
      minPoints: 5000,
    },
    {
      name: "Walmart",
      value: "$100",
      color: "bg-blue-600",
      image: IMAGES.brands.walmart,
      minPoints: 10000,
    },
    {
      name: "Best Buy",
      value: "$75",
      color: "bg-yellow-500",
      image: IMAGES.brands.bestBuy,
      minPoints: 7500,
    },
    {
      name: "Starbucks",
      value: "$20",
      color: "bg-green-600",
      image: IMAGES.brands.starbucks,
      minPoints: 2000,
    },
    {
      name: "Nike",
      value: "$50",
      color: "bg-gray-800",
      image: IMAGES.brands.nike,
      minPoints: 5000,
    },
  ];
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Member",
      image: IMAGES.testimonial1,
      content:
        "I've earned over $500 in gift cards just by taking surveys in my spare time. The platform is super easy to use!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Power User",
      image: IMAGES.testimonial2,
      content:
        "The variety of surveys keeps things interesting, and the rewards are always delivered promptly.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "New Member",
      image: IMAGES.testimonial3,
      content:
        "Started last month and already earned enough for two Amazon gift cards. Great experience so far!",
      rating: 4,
    },
  ];

  const process = [
    {
      title: "Sign Up",
      description: "Create your free account in seconds",
      image: IMAGES.step1,
      benefits: [
        "Instant account activation",
        "Secure & private",
        "No credit card required",
      ],
    },
    {
      title: "Take Surveys",
      description: "Choose from hundreds of available surveys",
      image: IMAGES.step2,
      benefits: [
        "Daily new opportunities",
        "Mobile-friendly platform",
        "Flexible schedule",
      ],
    },
    {
      title: "Get Rewarded",
      description: "Redeem points for gift cards",
      image: IMAGES.step3,
      benefits: [
        "Fast redemption",
        "Multiple reward options",
        "Regular bonuses",
      ],
    },
  ];

  // FAQ Data
  const faqs = [
    {
      question: "How much can I earn?",
      answer:
        "Earnings vary based on survey length and complexity. Most users earn between $50-$100 per month with regular participation.",
    },
    {
      question: "How do I get paid?",
      answer:
        "You can redeem your points for gift cards from popular retailers like Amazon, Target, and Walmart. Points are converted to rewards instantly upon redemption.",
    },
    {
      question: "How long do surveys take?",
      answer:
        "Most surveys take between 5-20 minutes to complete. You'll always see the estimated time before starting.",
    },
    {
      question: "Is it really free to join?",
      answer:
        "Yes, it's completely free to join and participate. We never charge any fees.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {typeof IMAGES.logo === "string" ? (
              // Render as an image if IMAGES.logo is a URL
              <img src={IMAGES.logo} alt="Logo" className="h-8" />
            ) : (
              // Render as a component if IMAGES.logo is an SVG/JSX
              <div className="h-8">{IMAGES.logo}</div>
            )}
            {/* <button
              onClick={() => scrollToSection("main")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Get Started
            </button> */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12" id="main">
        <div className="absolute inset-0">
          {/* <div className="absolute w-[500px] h-[500px] -top-[250px] -right-[250px] bg-blue-100 rounded-full mix-blend-multiply animate-pulse"></div> */}
          <div className="absolute w-[500px] h-[500px] top-1/3 -left-[250px] bg-indigo-100 rounded-full mix-blend-multiply animate-pulse delay-300"></div>
          <div className="absolute w-[500px] h-[500px] bottom-0 right-1/3 bg-purple-100 rounded-full mix-blend-multiply animate-pulse delay-500"></div>
          {/* <div className="absolute w-[500px] h-[500px] bottom -left-[250px] bg-indigo-100 rounded-full mix-blend-multiply animate-pulse delay-300"></div> */}
        </div>
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Share Your Opinion,
            <br />
            Earn Rewards
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Join our community of survey takers and earn gift cards from your
            favorite brands. Start earning today with our $5 welcome bonus!
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {value}
              </div>
              <div className="text-gray-600">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.text}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Auth Section */}
        <div className="min-h-screen bg-gray-50" id="auth">
          <div className="flex min-h-screen">
            {/* Left Banner */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600" />
              <div className="absolute inset-0 bg-[url('/api/placeholder/800/600')] mix-blend-overlay opacity-20" />
              <div className="relative w-full flex flex-col justify-center px-16 py-12">
                <h1 className="text-5xl font-bold text-white mb-8">
                  {isLogin ? "Welcome Back!" : "Join Our Community"}
                </h1>
                <p className="text-xl text-white/90 mb-12">
                  {isLogin
                    ? "Log in to access your account and continue your journey with us."
                    : "Create an account today and start earning rewards while supporting sustainable practices."}
                </p>
                <div className="space-y-8">
                  <div className="flex items-center space-x-6 bg-white/10 p-4 rounded-2xl backdrop-blur-lg">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Quick & Easy
                      </h3>
                      <p className="text-white/80">
                        Get started in less than 2 minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 bg-white/10 p-4 rounded-2xl backdrop-blur-lg">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Secure & Protected
                      </h3>
                      <p className="text-white/80">
                        Your data is always safe with us
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                      {isLogin ? "Welcome Back!" : "Start Earning Today"}
                    </h2>
                    {!isLogin && (
                      <div className="text-lg text-green-600 mt-3 font-medium">
                        Get a $5 WELCOME BONUS!
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <Mail
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={handleInputChange(setEmail)}
                          className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none"
                        />
                      </div>

                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={handleInputChange(setPassword)}
                          className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none"
                        />
                      </div>

                      {/* Consent Checkboxes for Registration */}
                      {!isLogin && (
                        <div className="space-y-3 mt-6">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id="cookies"
                              checked={consents.cookies}
                              onChange={handleConsentChange("cookies")}
                              className="mt-1"
                            />
                            <label
                              htmlFor="cookies"
                              className="text-sm text-gray-600"
                            >
                              I accept the use of cookies and similar
                              technologies
                            </label>
                          </div>

                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id="privacy"
                              checked={consents.privacy}
                              onChange={handleConsentChange("privacy")}
                              className="mt-1"
                            />
                            <label
                              htmlFor="privacy"
                              className="text-sm text-gray-600"
                            >
                              I have read and accept the{" "}
                              <a
                                href="https://privacy.opiniomea.com"
                                className="text-green-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Privacy Policy
                              </a>
                            </label>
                          </div>

                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id="terms"
                              checked={consents.terms}
                              onChange={handleConsentChange("terms")}
                              className="mt-1"
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm text-gray-600"
                            >
                              I agree to the{" "}
                              <a
                                href="https://termofcondition.opiniomea.com"
                                className="text-green-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Terms and Conditions
                              </a>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 rounded-xl flex items-center space-x-3">
                        <AlertCircle
                          className="text-red-500 flex-shrink-0"
                          size={20}
                        />
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      {isLogin ? "Login" : "Start Earning"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="w-full text-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                    >
                      {isLogin
                        ? "Don't have an account? Sign Up"
                        : "Already have an account? Login"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Process Section */}
        <div className="m-24" id="how-it-works">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start earning rewards in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-green-100 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300" />
                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  <div className="space-y-3">
                    {step.benefits.map((benefit, benefitIndex) => (
                      <div
                        key={benefitIndex}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle2
                          className="text-green-500 flex-shrink-0"
                          size={20}
                        />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Members Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied members who earn rewards daily
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                {/* Continuing from the testimonials map function */}
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={16}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Section */}
        <div
          className="py-16 bg-white rounded-3xl shadow-xl mb-24"
          id="rewards"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Choose Your Reward</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Convert your survey points into gift cards from your favorite
              brands
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {rewards.map((reward, index) => (
              <div key={index} className="group relative">
                <div
                  className={`absolute inset-0 ${reward.color} opacity-5 rounded-2xl transform transition-transform group-hover:scale-105`}
                />
                <div className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                  {reward.popular && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Popular
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={reward.image}
                        alt={reward.name}
                        className="w-16 h-8 object-contain"
                      />
                      <div>
                        <h3 className="text-xl font-bold">{reward.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {reward.minPoints} points required
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {reward.value}
                    </span>
                  </div>
                  <button className="w-full flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 rounded-xl transition-colors duration-200">
                    <span>Redeem now</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-24" id="faq">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-24">
          <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of members who are already earning rewards for
              their opinions. Sign up now and get your $5 welcome bonus!
            </p>
            <button
              onClick={() => scrollToSection("auth")}
              className="bg-white text-green-600 px-8 py-4 rounded-xl text-lg font-medium hover:shadow-lg transition-shadow duration-300"
            >
              Create Your Free Account
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={IMAGES.logo} alt="Logo" className="h-8 mb-4" />
              <p className="text-gray-600">
                Your trusted platform for online surveys and rewards.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="block text-gray-600 hover:text-green-600 text-left w-full"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection("rewards")}
                  className="block text-gray-600 hover:text-green-600 text-left w-full"
                >
                  Rewards
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="block text-gray-600 hover:text-green-600 text-left w-full"
                >
                  FAQ
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <div className="space-y-2">
                <a
                  href="https://privacy.opiniomea.com"
                  className="block text-gray-600 hover:text-green-600"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://termofcondition.opiniomea.com"
                  className="block text-gray-600 hover:text-green-600"
                >
                  Terms of Service
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2">
                <a
                  href="mailto:contactus@acutusai.com"
                  className="block text-gray-600 hover:text-green-600"
                >
                  contactus@acutusai.com
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 py-6 text-center text-gray-600">
            <p>
              © {new Date().getFullYear()} Survey Platform. All rights
              reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HeroSection;
