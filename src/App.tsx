/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  LanguageCode,
  SensorDataResponse,
  WeatherData,
  FarmerUser,
  FarmerField,
  DailyFarmRecommendation,
} from "./types";
import { englishTranslations } from "./data/translations";
import { Header } from "./components/Header";
import { FarmOverview } from "./components/FarmOverview";
import { SmartIrrigation } from "./components/SmartIrrigation";
import { CropDiseaseDetector } from "./components/CropDiseaseDetector";
import { WeatherAdvisory } from "./components/WeatherAdvisory";
import { MultilingualAdvisorChat } from "./components/MultilingualAdvisorChat";
import { FarmerAccountModal } from "./components/FarmerAccountModal";
import { FarmOnboardingModal } from "./components/FarmOnboardingModal";
import { FieldManagementModal } from "./components/FieldManagementModal";
import { LogIrrigationModal } from "./components/LogIrrigationModal";
import { AddJournalModal } from "./components/AddJournalModal";
import { speakText, stopSpeaking } from "./utils/speech";
import {
  LayoutDashboard,
  Droplets,
  Leaf,
  CloudSun,
  Mic,
  RefreshCw,
} from "lucide-react";

export default function App() {
  // Stored farmer ID, default to "farmer-1" (Ramesh Patil, Nashik)
  const [activeFarmerId, setActiveFarmerId] = useState<string>(() => {
    return localStorage.getItem("smart_farming_active_farmer_id") || "farmer-1";
  });

  const [farmer, setFarmer] = useState<FarmerUser | null>(null);
  const [demoFarmers, setDemoFarmers] = useState<any[]>([]);
  const [dailyRecommendations, setDailyRecommendations] = useState<DailyFarmRecommendation[]>([]);

  // Default language is English. Only AI Assistant conversation uses selected language.
  const [aiLanguage, setAiLanguage] = useState<LanguageCode>("en");
  const [activeTab, setActiveTab] = useState<
    "overview" | "irrigation" | "disease" | "weather" | "advisor"
  >("overview");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("nashik");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLoadingFarmer, setIsLoadingFarmer] = useState<boolean>(true);

  // Modals state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isFarmSetupOpen, setIsFarmSetupOpen] = useState<boolean>(false);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<FarmerField | null>(null);
  const [isLogIrrigationOpen, setIsLogIrrigationOpen] = useState<boolean>(false);
  const [selectedIrrigateFieldId, setSelectedIrrigateFieldId] = useState<string | undefined>(undefined);
  const [isAddJournalOpen, setIsAddJournalOpen] = useState<boolean>(false);

  // IoT Sensor Telemetry State across crops
  const [sensorData, setSensorData] = useState<SensorDataResponse>({
    zones: [
      {
        id: "zone-1",
        name: "Coconut Orchard (North Block)",
        crop: "coconut",
        moisturePercent: 32,
        soilTempC: 27.5,
        ecValue: 1.1,
        phLevel: 6.4,
        lastIrrigated: "Yesterday, 06:00 AM",
        pumpStatus: "OFF",
        recommendedWaterLiters: 45,
        status: "low",
      },
      {
        id: "zone-2",
        name: "Black Pepper Vines (Slope 2)",
        crop: "pepper",
        moisturePercent: 54,
        soilTempC: 25.2,
        ecValue: 0.9,
        phLevel: 5.8,
        lastIrrigated: "Today, 05:30 AM",
        pumpStatus: "OFF",
        recommendedWaterLiters: 0,
        status: "optimal",
      },
      {
        id: "zone-3",
        name: "Cardamom Shade Nursery",
        crop: "cardamom",
        moisturePercent: 26,
        soilTempC: 23.8,
        ecValue: 1.3,
        phLevel: 5.5,
        lastIrrigated: "2 days ago",
        pumpStatus: "OFF",
        recommendedWaterLiters: 20,
        status: "critical_dry",
      },
      {
        id: "zone-4",
        name: "Onion Field (Bed 4)",
        crop: "onion",
        moisturePercent: 38,
        soilTempC: 26.1,
        ecValue: 1.0,
        phLevel: 6.8,
        lastIrrigated: "Yesterday, 05:00 PM",
        pumpStatus: "OFF",
        recommendedWaterLiters: 25,
        status: "low",
      },
    ],
    totalWaterUsedTodayLiters: 1850,
    waterSavedThisMonthLiters: 11400,
    activePumpsCount: 0,
    systemAlertCount: 2,
  });

  // Weather state
  const [weatherData, setWeatherData] = useState<WeatherData>({
    district: "Nashik, Maharashtra",
    state: "Maharashtra",
    crops: ["Onion", "Tomato", "Grapes", "Soybean"],
    tempC: 29,
    humidityPercent: 64,
    rainfallChancePercent: 15,
    windSpeedKmh: 12,
    evapotranspirationMm: 4.8,
    uvIndex: 7,
    condition: "Sunny intervals with dry morning breeze",
    forecast: [
      { day: "Today", temp: "29° / 20°C", rain: "15%", icon: "sun", advisory: "Optimal for morning spray and weed scouting." },
      { day: "Tomorrow", temp: "30° / 21°C", rain: "10%", icon: "sun", advisory: "Check drip lateral drippers for clogging." },
      { day: "Thursday", temp: "29° / 20°C", rain: "20%", icon: "cloud", advisory: "Partly cloudy; safe for foliar nutrient feed." },
      { day: "Friday", temp: "28° / 19°C", rain: "40%", icon: "cloud", advisory: "Scattered showers likely; avoid heavy irrigation." },
    ],
    alerts: [
      {
        title: "Optimal Spray Window",
        message: "Calm morning conditions favorable for micronutrient spraying before 10 AM.",
        severity: "info",
      },
    ],
  });

  // Helper headers for authenticated farmer
  const getAuthHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      "x-farmer-id": activeFarmerId,
    };
  }, [activeFarmerId]);

  // Load active farmer profile and data
  const loadFarmerData = useCallback(
    async (farmerIdToLoad: string) => {
      try {
        setIsLoadingFarmer(true);
        const res = await fetch("/api/farmer/profile", {
          headers: {
            "Content-Type": "application/json",
            "x-farmer-id": farmerIdToLoad,
          },
        });

        if (res.ok) {
          const loaded: FarmerUser = await res.json();
          if (loaded && loaded.id) {
            setFarmer(loaded);
            setAiLanguage(loaded.profile.preferredLanguage);
            setSelectedDistrict(loaded.farm.district.toLowerCase());

            // Fetch real weather for farmer's district
            fetchWeatherForDistrict(loaded.farm.district);

            // Fetch recommendations
            fetchRecommendations(farmerIdToLoad);
          }
        }
      } catch (err) {
        console.error("Failed to load farmer profile:", err);
      } finally {
        setIsLoadingFarmer(false);
      }
    },
    []
  );

  // Load demo farmers list
  const loadDemoFarmers = async () => {
    try {
      const res = await fetch("/api/farmers/demo-list");
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) {
          setDemoFarmers(list);
        }
      }
    } catch (e) {
      console.error("Failed to load demo farmers:", e);
    }
  };

  // Fetch weather for district
  const fetchWeatherForDistrict = async (districtName: string) => {
    try {
      const res = await fetch(`/api/weather/${encodeURIComponent(districtName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.district) {
          setWeatherData({
            ...data,
            crops: data.crops || ["Onion", "Tomato", "Grapes", "Soybean"],
            forecast: data.forecast || [],
            alerts: data.alerts || [],
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch weather for district:", districtName, e);
    }
  };

  // Fetch recommendations
  const fetchRecommendations = async (farmerId: string) => {
    try {
      const res = await fetch("/api/farmer/recommendations", {
        headers: {
          "Content-Type": "application/json",
          "x-farmer-id": farmerId,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.recommendations) {
          setDailyRecommendations(data.recommendations);
        }
      }
    } catch (e) {
      console.error("Failed to load daily recommendations:", e);
    }
  };

  // Initial load
  useEffect(() => {
    loadFarmerData(activeFarmerId);
    loadDemoFarmers();
  }, [activeFarmerId, loadFarmerData]);

  // Handle switching demo farmer
  const handleSelectFarmer = async (farmerId: string) => {
    localStorage.setItem("smart_farming_active_farmer_id", farmerId);
    setActiveFarmerId(farmerId);
    await loadFarmerData(farmerId);
  };

  // Handle new farmer signup
  const handleSignUp = async (data: {
    name: string;
    mobile: string;
    preferredLanguage: LanguageCode;
    password?: string;
  }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Sign up failed");
    }

    const json = await res.json();
    const created: FarmerUser = json.farmer || json;
    if (created?.id) {
      localStorage.setItem("smart_farming_active_farmer_id", created.id);
      setActiveFarmerId(created.id);
      setFarmer(created);
      setAiLanguage(created.profile.preferredLanguage);
      await loadDemoFarmers();
    }
  };

  // Handle farmer login
  const handleLogin = async (usernameOrMobile: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrMobile }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }

    const json = await res.json();
    const loggedIn: FarmerUser = json.farmer || json;
    if (loggedIn?.id) {
      localStorage.setItem("smart_farming_active_farmer_id", loggedIn.id);
      setActiveFarmerId(loggedIn.id);
      setFarmer(loggedIn);
      setAiLanguage(loggedIn.profile.preferredLanguage);
      setSelectedDistrict(loggedIn.farm.district.toLowerCase());
      fetchWeatherForDistrict(loggedIn.farm.district);
      fetchRecommendations(loggedIn.id);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.setItem("smart_farming_active_farmer_id", "farmer-1");
    setActiveFarmerId("farmer-1");
    loadFarmerData("farmer-1");
  };

  // Handle Farm Setup / Onboarding Save
  const handleSaveFarmSetup = async (setupData: {
    name: string;
    mobile: string;
    preferredLanguage: LanguageCode;
    farmName: string;
    state: string;
    district: string;
    village: string;
    farmSizeAcres: number;
    soilType: string;
    irrigationMethod: string;
    waterSource: string;
  }) => {
    // 1. Update Profile
    await fetch("/api/farmer/profile", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: setupData.name,
        mobile: setupData.mobile,
        preferredLanguage: setupData.preferredLanguage,
      }),
    });

    // 2. Update Farm
    const farmRes = await fetch("/api/farmer/farm", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        farmName: setupData.farmName,
        state: setupData.state,
        district: setupData.district,
        village: setupData.village,
        farmSizeAcres: setupData.farmSizeAcres,
        soilType: setupData.soilType,
        irrigationMethod: setupData.irrigationMethod,
        waterSource: setupData.waterSource,
      }),
    });

    if (!farmRes.ok) {
      const err = await farmRes.json();
      throw new Error(err.error || "Failed to update farm details");
    }

    setAiLanguage(setupData.preferredLanguage);
    await loadFarmerData(activeFarmerId);
    await loadDemoFarmers();
  };

  // Handle Add / Edit Field
  const handleSaveField = async (fieldData: Partial<FarmerField>) => {
    if (fieldData.id) {
      // Edit existing field
      const res = await fetch(`/api/farmer/fields/${fieldData.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(fieldData),
      });
      if (!res.ok) throw new Error("Failed to update field");
    } else {
      // Add new field
      const res = await fetch("/api/farmer/fields", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(fieldData),
      });
      if (!res.ok) throw new Error("Failed to create field");
    }

    await loadFarmerData(activeFarmerId);
  };

  // Handle Delete Field
  const handleDeleteField = async (fieldId: string) => {
    const res = await fetch(`/api/farmer/fields/${fieldId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete field");
    await loadFarmerData(activeFarmerId);
  };

  // Handle Record Irrigation Event
  const handleRecordIrrigation = async (data: {
    fieldId: string;
    amountLiters: number;
    durationMinutes: number;
    method: string;
    notes?: string;
  }) => {
    const res = await fetch("/api/farmer/irrigation", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to record irrigation event");
    await loadFarmerData(activeFarmerId);
  };

  // Handle Add Journal / Timeline Update
  const handleAddJournal = async (data: any) => {
    const res = await fetch("/api/farmer/updates", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add journal update");
    await loadFarmerData(activeFarmerId);
  };

  // Telemetry controls (for fallback / generic zones)
  const fetchSensors = async () => {
    try {
      const res = await fetch("/api/sensors");
      if (res.ok) {
        const data = await res.json();
        setSensorData(data);
      }
    } catch (e) {
      console.error("Failed to fetch sensor data", e);
    }
  };

  const handleTogglePump = async (zoneId: string, action: "ON" | "OFF") => {
    try {
      const res = await fetch("/api/irrigation/pump", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneId, action }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSensorData(updated);

        // Also check if this matches a farmer field
        if (farmer?.fields.some((f) => f.id === zoneId)) {
          await loadFarmerData(activeFarmerId);
        }
      }
    } catch (e) {
      console.error("Pump toggle failed", e);
    }
  };

  const handleSimulateEnv = async (mode: "normal" | "dry_spell" | "post_rain") => {
    try {
      const res = await fetch("/api/simulate/environment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSensorData(updated);
      }
    } catch (e) {
      console.error("Simulation failed", e);
    }
  };

  const handleSpeak = (text: string, lang: LanguageCode = aiLanguage) => {
    speakText(
      text,
      lang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const t = englishTranslations;

  const navItems = [
    { id: "overview", label: t.tabs.overview, icon: LayoutDashboard },
    { id: "irrigation", label: t.tabs.irrigation, icon: Droplets },
    { id: "disease", label: t.tabs.disease, icon: Leaf },
    { id: "weather", label: t.tabs.weather, icon: CloudSun },
    { id: "advisor", label: t.tabs.advisor, icon: Mic },
  ];

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans pb-20 md:pb-8">
      {/* Primary Header with Farmer Profile & AI Language Selector */}
      <Header
        farmer={farmer || undefined}
        aiLanguage={aiLanguage}
        onAiLanguageChange={(newLang) => {
          setAiLanguage(newLang);
          if (farmer) {
            fetch("/api/farmer/profile", {
              method: "PUT",
              headers: getAuthHeaders(),
              body: JSON.stringify({ preferredLanguage: newLang }),
            });
          }
        }}
        selectedDistrict={selectedDistrict}
        onDistrictChange={(d) => {
          setSelectedDistrict(d);
          fetchWeatherForDistrict(d);
        }}
        isSpeaking={isSpeaking}
        onStopSpeaking={handleStopSpeaking}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        onOpenFarmSetup={() => setIsFarmSetupOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Desktop Navigation Tabs - Strictly English */}
        <div className="hidden md:flex items-center justify-between border-b border-stone-200 pb-3">
          <nav className="flex items-center gap-1 bg-stone-200/70 p-1.5 rounded-2xl border border-stone-300/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-stone-700 hover:text-stone-950 hover:bg-stone-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-stone-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Farmer Status Pill */}
          {farmer ? (
            <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {farmer.profile.name}'s Farm • {farmer.fields.length} Monitored Fields
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Smart Farming Active</span>
            </div>
          )}
        </div>

        {/* Tab Content Rendering - Interface in English, AI assistant in selected language */}
        {activeTab === "overview" && farmer && (
          <FarmOverview
            farmer={farmer}
            weatherData={weatherData}
            dailyRecommendations={dailyRecommendations}
            aiLanguage={aiLanguage}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSpeak={handleSpeak}
            onOpenAddField={() => {
              setEditingField(null);
              setIsAddFieldOpen(true);
            }}
            onEditField={(f) => {
              setEditingField(f);
              setIsAddFieldOpen(true);
            }}
            onOpenIrrigateModal={(fieldId) => {
              setSelectedIrrigateFieldId(fieldId);
              setIsLogIrrigationOpen(true);
            }}
            onOpenAddJournalModal={() => setIsAddJournalOpen(true)}
            onOpenFarmSetup={() => setIsFarmSetupOpen(true)}
            onRefreshRecommendations={() => fetchRecommendations(activeFarmerId)}
          />
        )}

        {activeTab === "irrigation" && (
          <SmartIrrigation
            farmer={farmer || undefined}
            aiLanguage={aiLanguage}
            sensorData={sensorData}
            onRefreshSensors={fetchSensors}
            onTogglePump={handleTogglePump}
            onSimulateEnv={handleSimulateEnv}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
            onStopSpeaking={handleStopSpeaking}
            onOpenLogIrrigation={(fieldId) => {
              setSelectedIrrigateFieldId(fieldId);
              setIsLogIrrigationOpen(true);
            }}
          />
        )}

        {activeTab === "disease" && (
          <CropDiseaseDetector
            farmer={farmer || undefined}
            aiLanguage={aiLanguage}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
            onStopSpeaking={handleStopSpeaking}
          />
        )}

        {activeTab === "weather" && (
          <WeatherAdvisory
            aiLanguage={aiLanguage}
            weatherData={weatherData}
            selectedDistrict={selectedDistrict}
            onDistrictChange={(d) => {
              setSelectedDistrict(d);
              fetchWeatherForDistrict(d);
            }}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
            onStopSpeaking={handleStopSpeaking}
          />
        )}

        {activeTab === "advisor" && (
          <MultilingualAdvisorChat
            farmer={farmer || undefined}
            aiLanguage={aiLanguage}
            onAiLanguageChange={(lang) => {
              setAiLanguage(lang);
              if (farmer) {
                fetch("/api/farmer/profile", {
                  method: "PUT",
                  headers: getAuthHeaders(),
                  body: JSON.stringify({ preferredLanguage: lang }),
                });
              }
            }}
            sensorData={sensorData}
            weatherData={weatherData}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
            onStopSpeaking={handleStopSpeaking}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar - Strictly English */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur text-white border-t border-stone-800 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition min-w-[56px] ${
                isActive ? "text-amber-400 font-extrabold" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-amber-400 scale-110" : "text-stone-400"}`} />
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[68px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modals */}
      {farmer && (
        <>
          <FarmerAccountModal
            isOpen={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
            currentFarmer={farmer}
            demoFarmers={demoFarmers}
            onSelectFarmer={handleSelectFarmer}
            onSignUp={handleSignUp}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onOpenFarmSetup={() => setIsFarmSetupOpen(true)}
          />

          <FarmOnboardingModal
            isOpen={isFarmSetupOpen}
            onClose={() => setIsFarmSetupOpen(false)}
            farmer={farmer}
            onSave={handleSaveFarmSetup}
          />

          <FieldManagementModal
            isOpen={isAddFieldOpen}
            onClose={() => {
              setIsAddFieldOpen(false);
              setEditingField(null);
            }}
            initialField={editingField}
            onSaveField={handleSaveField}
            onDeleteField={handleDeleteField}
          />

          <LogIrrigationModal
            isOpen={isLogIrrigationOpen}
            onClose={() => {
              setIsLogIrrigationOpen(false);
              setSelectedIrrigateFieldId(undefined);
            }}
            fields={farmer.fields}
            selectedFieldId={selectedIrrigateFieldId}
            onRecordIrrigation={handleRecordIrrigation}
          />

          <AddJournalModal
            isOpen={isAddJournalOpen}
            onClose={() => setIsAddJournalOpen(false)}
            fields={farmer.fields}
            onAddUpdate={handleAddJournal}
          />
        </>
      )}
    </div>
  );
}
