import React, { useState } from "react";
import { FarmerUser, LanguageCode } from "../types";
import { SUPPORTED_AI_LANGUAGES } from "../data/translations";
import {
  User,
  LogIn,
  UserPlus,
  LogOut,
  MapPin,
  CheckCircle,
  X,
  Phone,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";

interface FarmerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFarmer: FarmerUser;
  demoFarmers: Array<{
    id: string;
    name: string;
    mobile: string;
    preferredLanguage: LanguageCode;
    location: string;
    village?: string;
    farmSizeAcres: number;
    crops: string;
  }>;
  onSelectFarmer: (farmerId: string) => Promise<void>;
  onSignUp: (data: { name: string; mobile: string; preferredLanguage: LanguageCode; password?: string }) => Promise<void>;
  onLogin: (usernameOrMobile: string) => Promise<void>;
  onLogout: () => void;
  onOpenFarmSetup: () => void;
}

export const FarmerAccountModal: React.FC<FarmerAccountModalProps> = ({
  isOpen,
  onClose,
  currentFarmer,
  demoFarmers,
  onSelectFarmer,
  onSignUp,
  onLogin,
  onLogout,
  onOpenFarmSetup,
}) => {
  const [tab, setTab] = useState<"switch" | "login" | "signup" | "profile">("switch");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>("en");
  const [loginInput, setLoginInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDemoSwitch = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await onSelectFarmer(id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to switch farmer account");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      setError("Please provide both your name and 10-digit mobile number");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onSignUp({ name: name.trim(), mobile: mobile.trim(), preferredLanguage, password });
      onClose();
      onOpenFarmSetup(); // Open onboarding setup
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setError("Please enter your registered mobile number");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await onLogin(loginInput.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || "Login failed. Check mobile number or choose a demo farmer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-emerald-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Farmer Account & Profiles</h3>
              <p className="text-xs text-emerald-200">
                Current: <strong className="text-white">{currentFarmer.profile.name}</strong> ({currentFarmer.farm.district}, {currentFarmer.farm.state})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-bold text-stone-600">
          <button
            onClick={() => { setTab("switch"); setError(null); }}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition ${
              tab === "switch"
                ? "border-emerald-800 text-emerald-900 bg-white"
                : "border-transparent hover:text-stone-900"
            }`}
          >
            Demo Farmers
          </button>
          <button
            onClick={() => { setTab("signup"); setError(null); }}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition flex items-center justify-center gap-1 ${
              tab === "signup"
                ? "border-emerald-800 text-emerald-900 bg-white"
                : "border-transparent hover:text-stone-900"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>
          <button
            onClick={() => { setTab("login"); setError(null); }}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition flex items-center justify-center gap-1 ${
              tab === "login"
                ? "border-emerald-800 text-emerald-900 bg-white"
                : "border-transparent hover:text-stone-900"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Login
          </button>
          <button
            onClick={() => { setTab("profile"); setError(null); }}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition ${
              tab === "profile"
                ? "border-emerald-800 text-emerald-900 bg-white"
                : "border-transparent hover:text-stone-900"
            }`}
          >
            My Profile
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-5 mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
            {error}
          </div>
        )}

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {tab === "switch" && (
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                <p className="font-semibold flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Instant Prototype Switcher
                </p>
                <p>
                  Each farmer operates in a distinct Indian state with their own real crops, soil conditions, field telemetry, and weather advisory. Click any profile to test private data isolation:
                </p>
              </div>

              <div className="space-y-2.5">
                {demoFarmers.map((df) => {
                  const isCurrent = df.id === currentFarmer.id;
                  return (
                    <div
                      key={df.id}
                      onClick={() => !loading && handleDemoSwitch(df.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? "border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500 shadow-xs"
                          : "border-stone-200 hover:border-emerald-400 hover:bg-stone-50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900">{df.name}</span>
                          {isCurrent && (
                            <span className="bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle className="w-2.5 h-2.5" /> Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-500" />
                            {df.location}
                          </span>
                          <span>•</span>
                          <span>{df.farmSizeAcres} Acres</span>
                        </div>
                        <div className="text-[11px] text-emerald-900 font-medium bg-emerald-100/60 inline-block px-2 py-0.5 rounded-md">
                          Crops: {df.crops}
                        </div>
                      </div>

                      <button
                        disabled={loading}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition shrink-0 ${
                          isCurrent
                            ? "bg-emerald-800 text-white cursor-default"
                            : "bg-stone-200 text-stone-800 hover:bg-emerald-800 hover:text-white"
                        }`}
                      >
                        {isCurrent ? "Active" : "Switch"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "signup" && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
              <p className="text-stone-600 text-xs leading-relaxed">
                Create your individual farmer account. Once registered, you will be guided to set up your specific farm location, soil type, and crop fields.
              </p>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Farmer Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Balwinder Singh / Shrikant Joshi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Mobile Number (10 digits) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822012345"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Preferred AI Advisor Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as LanguageCode)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                >
                  {SUPPORTED_AI_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.label} ({lang.nativeLabel})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Dashboard interface stays in English; AI Advisor will converse in this language.
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Password (Optional for prototype)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="Optional 4-6 digit PIN"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? "Creating Account..." : "Create Account & Set Up Farm"}
              </button>
            </form>
          )}

          {tab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <p className="text-stone-600 text-xs">
                Enter your registered 10-digit mobile number or full name to access your private farm dashboard.
              </p>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Mobile Number or Farmer ID *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9822012345 or Ramesh Patil"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Logging in..." : "Login to My Farm"}
              </button>
            </form>
          )}

          {tab === "profile" && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Farmer Name:</span>
                  <span className="font-bold text-stone-900">{currentFarmer.profile.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Mobile:</span>
                  <span className="font-bold text-stone-900">{currentFarmer.profile.mobile}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Farm Location:</span>
                  <span className="font-bold text-stone-900">
                    {currentFarmer.farm.village ? `${currentFarmer.farm.village}, ` : ""}
                    {currentFarmer.farm.district}, {currentFarmer.farm.state}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Total Farm Size:</span>
                  <span className="font-bold text-emerald-800">{currentFarmer.farm.farmSizeAcres} Acres</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Soil Type:</span>
                  <span className="font-medium text-stone-800">{currentFarmer.farm.soilType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Irrigation System:</span>
                  <span className="font-medium text-stone-800">{currentFarmer.farm.irrigationMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500 font-semibold">Active Fields:</span>
                  <span className="font-bold text-emerald-900">{currentFarmer.fields.length} Fields Monitored</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenFarmSetup();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition flex items-center justify-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Edit Farm Details
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="py-2 px-3 rounded-xl bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-700 font-bold transition flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
