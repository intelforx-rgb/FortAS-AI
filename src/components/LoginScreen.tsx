import React from "react";
import {
  LogIn,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  FileText,
} from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
  onGuestAccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onGuestAccess,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex flex-col items-center p-8 space-y-16">
      {/* ========== 1. Welcome Section ========== */}
      <div className="max-w-3xl text-center space-y-6">
        {/* Brand Name & Tagline */}
        <div className="mb-6">
          <h1 className="text-slate-900 font-extrabold text-5xl md:text-6xl tracking-tight animate-fade-in-up">
            PlantAS <span className="text-blue-700">AI</span>
          </h1>
          <p className="text-yellow-600 text-xl md:text-2xl font-semibold mt-3 animate-fade-in">
            AI-Driven Engineering for Industrial Plant Excellence
          </p>
        </div>

        {/* Welcome Message */}
        <h2 className="text-4xl font-bold text-slate-800 leading-tight animate-fade-in-up delay-200">
          Welcome to PlantAS AI
        </h2>
        <p className="text-slate-600 text-lg animate-fade-in delay-300">
          <span className="text-blue-700">AI-powered Industrial Plant Operations, Safety & Efficiency Expert — your trusted partner in building and optimizing world-class industrial plants</span>
        </p>
      </div>

      {/* ========== 2. Login & Guest Access Section ========== */}
      <div className="w-full max-w-2xl space-y-12">
        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-blue-200 hover:border-blue-400 transition-all duration-300">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <LogIn className="text-white w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              🔑 Login / Register
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Access advanced features and personalized experience
            </p>
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center gap-3">
                <Shield className="text-blue-600 w-5 h-5" />
                <span className="text-slate-700 font-semibold">
                  Save chat history & detailed reports
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-green-600 w-5 h-5" />
                <span className="text-slate-700 font-semibold">
                  Extended session capabilities
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="text-purple-600 w-5 h-5" />
                <span className="text-slate-700 font-semibold">
                  Personalized plant recommendations
                </span>
              </div>
            </div>
            <button
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-4 px-6 rounded-xl
                       hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl
                       flex items-center justify-center gap-3 text-lg"
            >
              <LogIn size={20} />
              Login / Register
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Guest Access Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-yellow-200 hover:border-yellow-400 transition-all duration-300">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Zap className="text-white w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              ⚡ Quick Guest Access
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Continue without login for fast one-time queries
            </p>
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-center gap-3">
                <ArrowRight className="text-yellow-600 w-5 h-5" />
                <span className="text-slate-700 font-semibold">
                  Instant access to AI assistant
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowRight className="text-yellow-600 w-5 h-5" />
                <span className="text-slate-700 font-semibold">
                  No registration required
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ArrowRight className="text-yellow-600 w-5 h-5" />
                <span className="text-slate-700 font-semibold">
                  Perfect for quick consultations
                </span>
              </div>
            </div>
            <button
              onClick={onGuestAccess}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold py-4 px-6 rounded-xl
                       hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl
                       flex items-center justify-center gap-3 text-lg"
            >
              <Zap size={20} />
              Continue as Guest
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ========== 3. About Founder Section ========== */}
      <div className="max-w-3xl text-center space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-300">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-500 shadow-2xl mx-auto mb-6">
            <img
              src="/untitled (10).jpeg"
              alt="PlantAS AI | AI-Driven Engineering for Industrial Plant Excellence by Vipul Sharma"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Vipul Sharma</h2>
          <p className="text-yellow-600 font-semibold text-lg mb-1">Founder</p>
          <p className="text-slate-600 text-base leading-relaxed">
            We are an AI-powered Industrial Plant Operations, Safety & Efficiency
            Expert — your trusted partner in building and optimizing world-class
            industrial plants.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12">
        <p className="text-slate-500 text-sm">
          Powered by{" "}
          <span className="text-blue-600 font-bold">Advanced AI Technology</span>{" "}
          | © 2024 Industrial Plant Expert
        </p>
      </div>
    </div>
  );
};