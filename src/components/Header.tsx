import React from "react";
import { LanguageCode, FarmerUser } from "../types";
import { englishTranslations, SUPPORTED_AI_LANGUAGES } from "../data/translations";
import {
  Sprout,
  MapPin,
  Volume2,
  VolumeX,
  Sparkles,
  Languages,
  User,
  Compass,
  Layers,
} from "lucide-react";

interface HeaderProps {
  farmer?: FarmerUser;
  aiLanguage: LanguageCode;
  onAiLanguageChange: (lang: LanguageCode) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
  onOpenAccountModal: () => void;
  onOpenFarmSetup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  farmer,
  aiLanguage,
  onAiLanguageChange,
  selectedDistrict,
  onDistrictChange,
  isSpeaking,
  onStopSpeaking,
  onOpenAccountModal,
  onOpenFarmSetup,
}) => {
  const t = englishTranslations;
  const currentLangObj = SUPPORTED_AI_LANGUAGES.find((l) => l.code === aiLanguage) || SUPPORTED_AI_LANGUAGES[0];

  return (
    <header className="bg-emerald-950 text-white shadow-md sticky top-0 z-40 border-b border-emerald-900/60">
      {/* Voice status banner if reading aloud */}
      {isSpeaking && (
        <div className="bg-amber-600 text-amber-50 px-4 py-1.5 text-xs font-semibold flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>Reading AI advice aloud in {currentLangObj.label}...</span>
          </div>
          <button
            onClick={onStopSpeaking}
            className="flex items-center gap-1 bg-amber-800 hover:bg-amber-900 px-2.5 py-0.5 rounded text-xs text-white"
          >
            <VolumeX className="w-3.5 h-3.5" />
            Stop Audio
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity - Strictly English */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 border border-emerald-400/40 flex items-center justify-center shadow-inner text-emerald-100">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  {t.appName}
                  <span className="bg-emerald-800 border border-emerald-600/60 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full text-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" /> AI
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-emerald-200/90 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Quick Audio toggle on mobile */}
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="md:hidden p-2 rounded-lg bg-emerald-800 text-amber-300 hover:bg-emerald-700"
              title="Stop audio"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
            </button>
          )}
        </div>

        {/* Action Controls: Farmer Account, Farm Setup, & AI Assistant Language Selector */}
        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
          {/* Farmer Profile / Account Switcher Button */}
          {farmer ? (
            <button
              onClick={onOpenAccountModal}
              className="flex items-center gap-2 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700/80 rounded-xl px-3 py-1.5 text-xs text-left transition"
              title="Switch farmer profile or manage account"
            >
              <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center">
                {farmer.profile.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-white block leading-tight text-xs">
                  {farmer.profile.name}
                </span>
                <span className="text-[10px] text-emerald-300 block">
                  {farmer.farm.district}, {farmer.farm.state}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-700 font-bold ml-0.5">
                My Farm
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAccountModal}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold transition"
            >
              <User className="w-3.5 h-3.5" />
              Farmer Login / Sign Up
            </button>
          )}

          {/* Multilingual AI Language Selector (Specific to AI Assistant conversation) */}
          <div className="flex items-center bg-emerald-900/80 px-2.5 py-1.5 rounded-xl border border-emerald-700/60 text-xs">
            <Languages className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
            <span className="text-emerald-200 font-semibold mr-1.5 hidden lg:inline">AI Language:</span>
            <select
              value={aiLanguage}
              onChange={(e) => onAiLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer pr-1 text-xs"
              aria-label="Select AI Assistant Language"
            >
              {SUPPORTED_AI_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-stone-900 text-stone-100">
                  {lang.flag} {lang.label} ({lang.nativeLabel})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
