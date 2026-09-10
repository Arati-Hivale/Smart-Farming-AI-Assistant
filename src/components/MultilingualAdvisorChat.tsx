import React, { useState, useEffect, useRef } from "react";
import { LanguageCode, ChatMessage, SensorDataResponse, WeatherData, FarmerUser } from "../types";
import {
  englishTranslations,
  SUPPORTED_AI_LANGUAGES,
  AI_LANGUAGE_PROFILES,
} from "../data/translations";
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  stopSpeaking,
} from "../utils/speech";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  RefreshCw,
  Languages,
  CheckCircle,
} from "lucide-react";

interface MultilingualAdvisorChatProps {
  aiLanguage: LanguageCode;
  onAiLanguageChange: (lang: LanguageCode) => void;
  sensorData: SensorDataResponse;
  weatherData: WeatherData;
  farmer?: FarmerUser;
  onSpeak: (text: string, lang?: LanguageCode) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const MultilingualAdvisorChat: React.FC<MultilingualAdvisorChatProps> = ({
  aiLanguage,
  onAiLanguageChange,
  sensorData,
  weatherData,
  farmer,
  onSpeak,
  isSpeaking,
  onStopSpeaking,
}) => {
  const t = englishTranslations;
  const currentProfile = AI_LANGUAGE_PROFILES[aiLanguage] || AI_LANGUAGE_PROFILES["en"];
  const currentLangMeta = SUPPORTED_AI_LANGUAGES.find((l) => l.code === aiLanguage) || SUPPORTED_AI_LANGUAGES[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize or update welcoming message when language changes
  useEffect(() => {
    setMessages((prev) => {
      // If empty or initial message exists, set greeting for current language
      if (prev.length === 0 || (prev.length === 1 && prev[0].id === "initial")) {
        return [
          {
            id: "initial",
            sender: "assistant",
            text: currentProfile.greeting,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            language: aiLanguage,
          },
        ];
      }
      // If existing conversation, add an informative system note in the assistant message
      return [
        ...prev,
        {
          id: `lang-switch-${Date.now()}`,
          sender: "assistant",
          text: `[AI Language switched to ${currentLangMeta.label} (${currentLangMeta.nativeLabel})]\n${currentProfile.greeting}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          language: aiLanguage,
        },
      ];
    });
  }, [aiLanguage]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      language: aiLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setVoiceNotice(null);

    try {
      const avgMoisture = Math.round(
        sensorData.zones.reduce((acc, z) => acc + z.moisturePercent, 0) /
          sensorData.zones.length
      );

      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(farmer?.id ? { "x-farmer-id": farmer.id } : {}),
        },
        body: JSON.stringify({
          question: query,
          language: aiLanguage,
          farmContext: {
            farmerName: farmer?.profile.name || "Indian Farmer",
            location: farmer ? `${farmer.farm.village ? `${farmer.farm.village}, ` : ""}${farmer.farm.district}, ${farmer.farm.state}` : weatherData.district,
            farmSize: farmer ? `${farmer.farm.farmSizeAcres} Acres` : "3.5 Acres",
            soilType: farmer?.farm.soilType || "Medium Black Soil",
            irrigationMethod: farmer?.farm.irrigationMethod || "Drip Irrigation",
            fields: farmer?.fields.map((f) => `${f.name} (${f.cropDisplayName || f.crop}, ${f.areaAcres} ac, moisture: ${f.soilMoisturePercent}%, health: ${f.cropHealthStatus})`).join("; ") || "General crop plots",
            weather: `${weatherData.tempC}°C, ${weatherData.humidityPercent}% humidity, rain probability ${weatherData.rainfallChancePercent}%, condition: ${weatherData.condition}`,
            avgMoisture: `${avgMoisture}%`,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact advisor service");
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        language: aiLanguage,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      // Speak the answer aloud in the selected language
      onSpeak(data.answer, aiLanguage);
    } catch (e: any) {
      console.error("Chat error:", e);
      const fallback = currentProfile.fallbackReply;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          language: aiLanguage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Input Speech Recognition
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setVoiceNotice("Speech recognition is not supported in this browser. You can type your question.");
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    try {
      stopSpeaking();
      setVoiceNotice(`Listening in ${currentLangMeta.label} (${currentLangMeta.nativeLabel})...`);

      const recognizer = createSpeechRecognizer(
        aiLanguage,
        (recognizedText) => {
          setInputText(recognizedText);
          setIsListening(false);
          setVoiceNotice(null);
          handleSendMessage(recognizedText);
        },
        (error) => {
          console.warn("Speech recognition error:", error);
          setIsListening(false);
          setVoiceNotice("Voice input cancelled or not recognized. Try again or type.");
          setTimeout(() => setVoiceNotice(null), 3000);
        },
        () => {
          setIsListening(false);
        }
      );

      if (recognizer) {
        recognitionRef.current = recognizer;
        recognizer.start();
        setIsListening(true);
      }
    } catch (e) {
      console.error("Failed to start voice recognition", e);
      setIsListening(false);
      setVoiceNotice("Could not access microphone.");
    }
  };

  return (
    <div className="space-y-6" id="multilingual-advisor-section">
      {/* Header Banner - Strictly English UI */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-700/60 text-emerald-200">
              <Bot className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold">{t.advisor.title}</h2>
          </div>
          <p className="text-sm text-emerald-100/90">{t.advisor.subtitle}</p>
        </div>

        {/* Action controls: Dedicated Language Dropdown and Voice Mic */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Selector Requirement 2 & 3: Clean Language Dropdown */}
          <div className="bg-emerald-950/80 border-2 border-amber-400/80 rounded-xl px-3 py-2 flex items-center gap-2 shadow-inner">
            <Languages className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex flex-col">
              <label htmlFor="ai-language-select" className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Language
              </label>
              <select
                id="ai-language-select"
                value={aiLanguage}
                onChange={(e) => onAiLanguageChange(e.target.value as LanguageCode)}
                className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer pr-2"
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

          {/* Large Tactile Voice Input Button */}
          <button
            type="button"
            id="voice-input-toggle-button"
            onClick={toggleVoiceInput}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm shadow-md flex items-center gap-2 transition-all ${
              isListening
                ? "bg-red-600 hover:bg-red-700 text-white animate-pulse ring-4 ring-red-400/40"
                : "bg-amber-500 hover:bg-amber-600 text-stone-950 ring-2 ring-amber-300"
            }`}
            title="Speak your question in your selected language"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>{t.advisor.listening}</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-stone-950" />
                <span>{t.advisor.holdToSpeak}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Voice Status Alert if active */}
      {voiceNotice && (
        <div className="bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2 rounded-xl text-xs flex items-center justify-between">
          <span>{voiceNotice}</span>
          <button onClick={() => setVoiceNotice(null)} className="font-bold underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Suggested 1-Tap Questions in the Farmer's Selected Language */}
      <div className="bg-stone-100/90 border border-stone-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            {t.advisor.presetQuestionsTitle} ({currentLangMeta.label})
          </span>
          <span className="text-[11px] text-stone-500">
            Selected: <span className="font-semibold text-emerald-800">{currentLangMeta.flag} {currentLangMeta.label}</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentProfile.presets.map((preset, idx) => (
            <button
              key={idx}
              id={`preset-question-${idx}`}
              onClick={() => handleSendMessage(preset)}
              className="text-left text-xs p-3 rounded-xl bg-white hover:bg-emerald-50/80 border border-stone-200 hover:border-emerald-400 text-stone-800 transition font-medium line-clamp-2 shadow-xs"
            >
              💬 {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col h-[500px]">
        {/* Language banner indicator at top of chat */}
        <div className="pb-3 mb-3 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>AI Response Language:</span>
            <span className="font-bold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              {currentLangMeta.flag} {currentLangMeta.label} ({currentLangMeta.nativeLabel})
            </span>
          </div>
          <span className="text-[11px] text-stone-400">Supported Crops: 10 Indian Crops</span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-emerald-700 text-white rounded-tr-none font-medium"
                      : "bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-none space-y-2"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  <div className="flex items-center justify-between gap-3 pt-2 text-[10px] opacity-75 border-t border-stone-200/50 mt-1">
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => onSpeak(msg.text, aiLanguage)}
                        className="hover:opacity-100 flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-100/90 px-2.5 py-1 rounded-md transition"
                        title="Listen to AI response in selected language"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{t.advisor.audioListen}</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-900 flex items-center justify-center shrink-0 shadow-sm mt-1 font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center shrink-0 animate-bounce">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl rounded-tl-none p-3.5 text-xs text-stone-600 flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                <span>Generating advice in {currentLangMeta.label} ({currentLangMeta.nativeLabel})...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 pt-3 border-t border-stone-200 flex items-center gap-2"
        >
          {/* Quick Voice mic button right next to text input */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-3 rounded-xl transition border ${
              isListening
                ? "bg-red-600 text-white border-red-700 animate-pulse"
                : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300"
            }`}
            title="Click to speak your question"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            id="advisor-chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask in ${currentLangMeta.label} or English (irrigation, diseases, fertilizers, weather)...`}
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />

          <button
            type="submit"
            id="advisor-send-button"
            disabled={!inputText.trim() || isLoading}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition shadow"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.advisor.send}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
