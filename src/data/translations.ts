import { LanguageCode, SupportedCrop } from "../types";

export interface TranslationSet {
  appName: string;
  tagline: string;
  selectLanguage: string;
  tabs: {
    overview: string;
    irrigation: string;
    disease: string;
    weather: string;
    advisor: string;
  };
  overview: {
    title: string;
    subheading: string;
    farmHealthStatus: string;
    good: string;
    attentionRequired: string;
    activeSensors: string;
    waterSaved: string;
    liters: string;
    todayWeather: string;
    quickVoicePrompt: string;
    urgentAlerts: string;
    noUrgentAlerts: string;
    viewDetails: string;
    startIrrigation: string;
    scanDisease: string;
    talkToAdvisor: string;
  };
  irrigation: {
    title: string;
    subtitle: string;
    soilMoistureStatus: string;
    optimalMoistureRange: string;
    pumpControl: string;
    pumpOn: string;
    pumpOff: string;
    turnOnPump: string;
    turnOffPump: string;
    recommendedDose: string;
    lastIrrigated: string;
    simWaterSavings: string;
    simulateConditions: string;
    simNormal: string;
    simDrySpell: string;
    simPostRain: string;
    aiSchedulerTitle: string;
    calculateSmartSchedule: string;
    calculating: string;
    zoneName: string;
    moisture: string;
    temp: string;
    electricalCond: string;
    soilPh: string;
    criticalDry: string;
    lowMoisture: string;
    optimalMoisture: string;
    saturatedMoisture: string;
  };
  disease: {
    title: string;
    subtitle: string;
    selectCrop: string;
    allCrops: string;
    uploadTitle: string;
    uploadInstructions: string;
    chooseFile: string;
    orTakeSample: string;
    sampleCases: string;
    analyzingImage: string;
    diagnoseButton: string;
    diagnosisResult: string;
    severityLevel: string;
    confidence: string;
    symptoms: string;
    causes: string;
    immediateActions: string;
    organicRemedies: string;
    chemicalRemedies: string;
    preventiveMeasures: string;
    audioListen: string;
    audioStop: string;
    newScan: string;
  };
  weather: {
    title: string;
    subtitle: string;
    selectDistrict: string;
    temperature: string;
    humidity: string;
    rainProbability: string;
    windSpeed: string;
    evaporation: string;
    uvIndex: string;
    advisoryCalendar: string;
    sprayForecast: string;
    drainageAlert: string;
    harvestForecast: string;
  };
  advisor: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    listening: string;
    speakNow: string;
    holdToSpeak: string;
    presetQuestionsTitle: string;
    preset1: string;
    preset2: string;
    preset3: string;
    preset4: string;
    botGreeting: string;
    audioListen: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    liters: string;
    save: string;
    refresh: string;
    status: string;
    healthy: string;
    risk: string;
  };
}

export const englishTranslations: TranslationSet = {
  appName: "Smart Kisan",
  tagline: "AI Agricultural Assistant for Indian Farmers",
  selectLanguage: "Language",
  tabs: {
    overview: "Farm Overview",
    irrigation: "Smart Irrigation",
    disease: "Crop Doctor",
    weather: "Weather Advisory",
    advisor: "AI Assistant",
  },
  overview: {
    title: "Namaste, Farmer Friend!",
    subheading: "Real-time precision insights for Coconut, Pepper, Cardamom, Onion, Cotton, Soybean, Sugarcane, Tomato, Wheat & Rice.",
    farmHealthStatus: "Overall Farm Status",
    good: "Good & Stable",
    attentionRequired: "Watering Needed in Monitored Zones",
    activeSensors: "IoT Sensors Active",
    waterSaved: "Water Conserved This Month",
    liters: "Liters",
    todayWeather: "Today's Farm Climate",
    quickVoicePrompt: "Ask the Multilingual AI Assistant in your native language below.",
    urgentAlerts: "Critical Farming Alerts",
    noUrgentAlerts: "No critical alerts. Farm conditions are currently optimal.",
    viewDetails: "View Details",
    startIrrigation: "Manage Irrigation",
    scanDisease: "Check Crop Health",
    talkToAdvisor: "Ask AI Assistant",
  },
  irrigation: {
    title: "Smart Irrigation & Soil Moisture",
    subtitle: "Real-time IoT soil sensors combined with weather forecasting to reduce water wastage.",
    soilMoistureStatus: "Live Soil Moisture by Crop Zone",
    optimalMoistureRange: "Ideal target: 50% - 70%",
    pumpControl: "Smart Pump Control",
    pumpOn: "Pump Running",
    pumpOff: "Pump Inactive",
    turnOnPump: "Start Drip Pump",
    turnOffPump: "Stop Pump",
    recommendedDose: "Recommended Irrigation",
    lastIrrigated: "Last Watered",
    simWaterSavings: "Water Saved vs Traditional Flood Irrigation",
    simulateConditions: "Simulate Farm Environmental Changes",
    simNormal: "Normal Routine",
    simDrySpell: "Simulate Hot Dry Spell",
    simPostRain: "Simulate Heavy Rain Runoff",
    aiSchedulerTitle: "AI Irrigation Recommendation Engine",
    calculateSmartSchedule: "Calculate AI Precision Schedule",
    calculating: "Analyzing soil moisture & weather with AI...",
    zoneName: "Farm Zone",
    moisture: "Moisture",
    temp: "Soil Temp",
    electricalCond: "Conductivity (EC)",
    soilPh: "Soil pH",
    criticalDry: "Critically Dry (Irrigate Now)",
    lowMoisture: "Low Moisture",
    optimalMoisture: "Optimal Moisture",
    saturatedMoisture: "Excess Water / Saturated",
  },
  disease: {
    title: "AI Crop Disease Detection",
    subtitle: "Upload a crop leaf, fruit, or stem image to identify diseases, pests, and get ICAR/organic treatments.",
    selectCrop: "Select Crop Being Tested",
    allCrops: "All Supported Crops",
    uploadTitle: "Upload Leaf / Trunk / Fruit Photo",
    uploadInstructions: "Take or upload a clear photo of the affected crop leaf, fruit, or stem for AI diagnosis.",
    chooseFile: "Choose Photo / Open Camera",
    orTakeSample: "Or test with real Indian agricultural sample cases:",
    sampleCases: "Load Common Disease Case",
    analyzingImage: "Diagnosing disease and pest symptoms with AI...",
    diagnoseButton: "Run AI Disease Diagnosis",
    diagnosisResult: "Pathology Diagnosis & Treatment Plan",
    severityLevel: "Severity Level",
    confidence: "Diagnosis Confidence",
    symptoms: "Observed Symptoms",
    causes: "Probable Causes",
    immediateActions: "What to do Today (Immediate Steps)",
    organicRemedies: "Organic & Bio-Control Remedies",
    chemicalRemedies: "Recommended Chemical Treatment (ICAR standard dosage)",
    preventiveMeasures: "Long-term Preventive Measures",
    audioListen: "Listen to Advice (Audio)",
    audioStop: "Stop Audio",
    newScan: "Scan Another Plant",
  },
  weather: {
    title: "Weather-Based Agricultural Advisory",
    subtitle: "Plan spraying, fertilizer application, and irrigation ahead of upcoming weather events.",
    selectDistrict: "Select Agricultural District",
    temperature: "Air Temperature",
    humidity: "Relative Humidity",
    rainProbability: "Rain Probability",
    windSpeed: "Wind Speed",
    evaporation: "Evapotranspiration",
    uvIndex: "UV Index",
    advisoryCalendar: "Farming Activity Advisory",
    sprayForecast: "Spraying Advisory",
    drainageAlert: "Drainage & Soil Care",
    harvestForecast: "Harvest & Drying Window",
  },
  advisor: {
    title: "Multilingual AI Agricultural Assistant",
    subtitle: "Ask questions by voice or text. Get real-time advice in your chosen Indian language.",
    placeholder: "Ask about irrigation, fertilizers, pests, diseases, or weather-based farming...",
    send: "Ask AI",
    listening: "Listening to your voice...",
    speakNow: "Speak in your language...",
    holdToSpeak: "Voice Input (Mic)",
    presetQuestionsTitle: "Suggested Questions for Today:",
    preset1: "How to prevent fungal disease in coconut and pepper during high humidity?",
    preset2: "What is the optimal drip irrigation schedule for tomato and onion crops?",
    preset3: "How to manage pink bollworm in cotton with organic pheromone traps?",
    preset4: "When should fertilizer and bio-fungicide be applied based on today's weather?",
    botGreeting: "Namaste! I am your Kisan Mitra AI Assistant. Ask me anything about crop health, diseases, smart irrigation, fertilizers, and weather advisories in your preferred language.",
    audioListen: "Read Aloud",
  },
  common: {
    loading: "Processing...",
    error: "An error occurred. Please try again.",
    retry: "Retry",
    close: "Close",
    liters: "Liters",
    save: "Save",
    refresh: "Refresh Data",
    status: "Status",
    healthy: "Healthy",
    risk: "Risk Detected",
  },
};

// Website UI remains strictly in English across all tabs and components
export const translations: Record<LanguageCode, TranslationSet> = {
  en: englishTranslations,
  hi: englishTranslations,
  mr: englishTranslations,
  ml: englishTranslations,
  ta: englishTranslations,
  te: englishTranslations,
  kn: englishTranslations,
  gu: englishTranslations,
  bn: englishTranslations,
  pa: englishTranslations,
};

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_AI_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी", flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", nativeLabel: "മലയാളം", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", nativeLabel: "ગુજરાતી", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা", flag: "🇮🇳" },
  { code: "pa", label: "Punjabi", nativeLabel: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
];

export interface AILanguageProfile {
  greeting: string;
  presets: [string, string, string, string];
  fallbackReply: string;
}

export const AI_LANGUAGE_PROFILES: Record<LanguageCode, AILanguageProfile> = {
  en: {
    greeting: "Namaste! I am your AI Smart Farming Assistant. You can ask me questions about irrigation, soil moisture, crop diseases, fertilizer dosages, and weather-based farm planning in English.",
    presets: [
      "How much water does an adult coconut palm require per day in dry weather?",
      "How to control purple blotch in onion and early blight in tomato?",
      "How to prevent pink bollworm infestation in cotton organically?",
      "When should I irrigate my wheat and rice crops based on current soil moisture?",
    ],
    fallbackReply: "Please ensure good soil drainage and avoid overwatering. For fungal symptoms, spray 1% Bordeaux mixture or Trichoderma viride.",
  },
  hi: {
    greeting: "नमस्ते किसान भाई! मैं आपका किसान मित्र AI सहायक हूँ। आप मुझसे सिंचाई, मिट्टी की नमी, फसल रोगों (नारियल, मिर्च, प्याज, कपास, टमाटर, गेहूं, धान), खाद और मौसम संबंधी कोई भी सवाल पूछ सकते हैं।",
    presets: [
      "प्याज के बैंगनी धब्बे (करपा) और टमाटर के झुलसा रोग का क्या उपचार है?",
      "कपास में गुलाबी सुंडी (गुलाबी इल्ली) को जैविक तरीके से कैसे रोकें?",
      "सूखे मौसम में नारियल और गन्ने को कितने लीटर पानी देना चाहिए?",
      "वर्तमान मिट्टी की नमी के अनुसार धान और गेहूं में सिंचाई कब करनी चाहिए?",
    ],
    fallbackReply: "नमस्ते! खेत में जलजमाव न होने दें। फफूंद जनित रोगों की रोकथाम के लिए 1% बोर्डो मिश्रण या ट्राइकोडर्मा विरिडी का छिड़काव करें।",
  },
  mr: {
    greeting: "रामराम शेतकरी बंधू! मी तुमचा शेतीमित्र AI सहाय्यक आहे. आपण मला ठिबक सिंचन, जमिनीतील ओलावा, नारळ, कांदा, कपाशी, ऊस, टोमॅटो, सोयाबीन पिकांवरील रोग व खत व्यवस्थापनाबद्दल मराठीत प्रश्न विचारू शकता.",
    presets: [
      "कांद्यावरील जांभळा करपा आणि टोमॅटोवरील रोगांवर प्रभावी उपाय काय?",
      "कपाशीवरील गुलाबी बोंडअळीच्या नियंत्रणासाठी कोणते कामगंध सापळे वापरावेत?",
      "उसाला आणि नारळाला ठिबक सिंचनाने किती पाणी द्यावे?",
      "सोयाबीनवरील तांबेरा रोग रोखण्यासाठी योग्य फवारणी कोणती?",
    ],
    fallbackReply: "रामराम! शेतामध्ये पाणी साचू देऊ नका. बुरशीजन्य रोगांसाठी ट्रायकोडर्मा किंवा 1% बोर्डो मिश्रणाचा वापर करा.",
  },
  ml: {
    greeting: "നമസ്കാരം പ്രിയ കർഷക സുഹൃത്തേ! ഞാൻ നിങ്ങളുടെ കിസാൻ മിത്ര എഐ സഹായിയാണ്. തെങ്ങ്, കുരുമുളക്, ഏലം, നെല്ല് കൃഷികളിലെ നന, രോഗങ്ങൾ, കീടനിയന്ത്രണം എന്നിവയെക്കുറിച്ച് ഏത് സംശയവും ചോദിക്കാം.",
    presets: [
      "വേനൽക്കാലത്ത് ഒരു തെങ്ങിന് ദിവസം എത്ര ലിറ്റർ വെള്ളം നൽകണം?",
      "കുരുമുളകിന്റെ ദ്രുതവാട്ടം (Foot Rot) തടയാൻ എന്ത് മുൻകരുതൽ എടുക്കണം?",
      "ഏലത്തിന് തണൽത്തോട്ടത്തിൽ അഴുകൽ രോഗം തടയാൻ ഏത് മരുന്ന് തളിക്കണം?",
      "മണ്ണിലെ ഈർപ്പം കുറയുമ്പോൾ തുള്ളിനന എത്ര സമയം പ്രവർത്തിപ്പിക്കണം?",
    ],
    fallbackReply: "നമസ്കാരം! തോട്ടത്തിൽ വെള്ളക്കെട്ട് ഒഴിവാക്കുക. കുമിൾബാധ തടയാൻ ബോർഡോ മിശ്രിതമോ ട്രൈക്കോഡെർമയോ ഉപയോഗിക്കുക.",
  },
  ta: {
    greeting: "வணக்கம் விவசாயத் தோழரே! நான் உங்கள் கிசான் AI உதவியாளர். சொட்டு நீர் பாசனம், தென்னை, மிளகு, வெங்காயம், பருத்தி, தக்காளி, நெல் பயிர் நோய்கள் மற்றும் உரங்கள் குறித்து தமிழில் கேட்கலாம்.",
    presets: [
      "தென்னை மரத்திற்கு கோடை காலத்தில் தினசரி எவ்வளவு தண்ணீர் தேவை?",
      "வெங்காயத்தில் கருகல் நோய் மற்றும் தக்காளியில் இலை சுருட்டல் வராமல் தடுப்பது எப்படி?",
      "பருத்தியில் இளஞ்சிவப்பு காய்ப்புழுவை இயற்கை முறையில் கட்டுப்படுத்துவது எப்படி?",
      "மண் ஈரப்பதத்திற்கு ஏற்ப நெல் பயிருக்கு நீர் பாசனம் எப்போது செய்ய வேண்டும்?",
    ],
    fallbackReply: "வணக்கம்! நிலத்தில் தண்ணீர் தேங்காமல் பார்த்துக் கொள்ளவும். பூஞ்சை நோய்களுக்கு 1% போர்டோ கலவை அல்லது டிரைக்கோடெர்மா விரடி தெளிக்கவும்.",
  },
  te: {
    greeting: "నమస్కారం రైతు సోదరులారా! నేను మీ కిసాన్ AI సహాయకుడిని. బిందు సేద్యం, కొబ్బరి, ఉల్లి, పత్తి, టమోటా, వరి పంటల తెగుళ్లు, ఎరువుల నిర్వహణ గురించి తెలుగులో అడగండి.",
    presets: [
      "ఎండ కాలంలో కొబ్బరి చెట్టుకు రోజుకు ఎన్ని లీటర్ల నీరు అవసరం?",
      "ఉల్లిలో ఆకుమచ్చ తెగులు, టమోటాలో ఆకుముడుతను ఎలా అరికట్టాలి?",
      "పత్తిలో గులాబీ రంగు కాయతొలుచు పురుగును సేంద్రీయంగా ఎలా నివారించాలి?",
      "ప్రస్తుత నేల తేమను బట్టి వరి పంటకు నీటి తడులు ఎప్పుడు ఇవ్వాలి?",
    ],
    fallbackReply: "నమస్కారం! పొలంలో నీరు నిలవకుండా చూసుకోండి. శిలీంధ్ర వ్యాధుల నివారణకు ట్రైకోడెర్మా లేదా 1% బోర్డో మిశ్రమాన్ని పిచికారీ చేయండి.",
  },
  kn: {
    greeting: "ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಾನು ನಿಮ್ಮ ಕಿಸಾನ್ AI ಸಹಾಯಕ. ಹನಿ ನೀರಾವರಿ, ತೆಂಗು, ಮೆಣಸು, ಏಲಕ್ಕಿ, ಈರುಳ್ಳಿ, ಹತ್ತಿ, ಟೊಮೆಟೊ, ಭತ್ತ ಬೆಳೆಗಳ ರೋಗಗಳು ಮತ್ತು ರಸಗೊಬ್ಬರಗಳ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನಿಸಿ.",
    presets: [
      "ಬೇಸಿಗೆಯಲ್ಲಿ ಒಂದು ತೆಂಗಿನ ಮರಕ್ಕೆ ದಿನಕ್ಕೆ ಎಷ್ಟು ಲೀಟರ್ ನೀರು ಬೇಕು?",
      "ಈರುಳ್ಳಿ ನೇರಳೆ ಮಚ್ಚೆ ರೋಗ ಮತ್ತು ಟೊಮೆಟೊ ರೋಗಗಳಿಗೆ ಪರಿಹಾರವೇನು?",
      "ಹತ್ತಿಯಲ್ಲಿ ಗುಲಾಬಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳುವನ್ನು ನಿಯಂತ್ರಿಸುವುದು ಹೇಗೆ?",
      "ಮಣ್ಣಿನ ತೇವಾಂಶಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಭತ್ತ ಮತ್ತು ಕಬ್ಬಿಗೆ ನೀರು ಯಾವಾಗ ಹಾಯಿಸಬೇಕು?",
    ],
    fallbackReply: "ನಮಸ್ಕಾರ! ಹೊಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಎಚ್ಚರವಹಿಸಿ. ಶಿಲೀಂಧ್ರ ರೋಗಗಳಿಗೆ ಟ್ರೈಕೋಡರ್ಮಾ ಅಥವಾ 1% ಬೋರ್ಡೋ ಮಿಶ್ರಣವನ್ನು ಸಿಂಪಡಿಸಿ.",
  },
  gu: {
    greeting: "નમસ્તે ખેડૂત મિત્ર! હું તમારો કિસાન AI સહાયક છું. તમે મને ટપક પદ્ધતિ, કપાસ, ડુંગળી, શેરડી, ટામેટાં અને ઘઉંના રોગો, ખાતર અને હવામાન આધારિત ખેતી વિશે ગુજરાતીમાં પૂછી શકો છો.",
    presets: [
      "ડુંગળીમાં જાંબલી ધબ્બા અને ટામેટાંમાં સુકારા રોગનું નિદાન અને ઉપાય શું?",
      "કપાસમાં ગુલાબી ઈયળના નિયંત્રણ માટે કયા ફેરોમોન ટ્રેપ લગાવવા?",
      "શેરડી અને નાળિયેરમાં ટપક સિંચાઈથી કેટલું પાણી આપવું જોઈએ?",
      "ઘઉં અને ચણાના પાકમાં હાલના ભેજ મુજબ ક્યારે પાણી આપવું?",
    ],
    fallbackReply: "નમસ્તે! ખેતરમાં પાણીનો ભરાવો ન થવા દો. ફૂગજન્ય રોગો માટે ટ્રાઇકોડર્મા અથવા 1% બોર્ડો મિશ્રણનો છંટકાવ કરો.",
  },
  bn: {
    greeting: "নমস্কার কৃষক বন্ধু! আমি আপনার কিষাণ এআই সহকারী। সেচ, মাটির আর্দ্রতা, ধান, গম, টমেটো, পেঁয়াজ ও নারকেলের রোগবালাই, সার প্রয়োগ এবং আবহাওয়া সংক্রান্ত যে কোনও প্রশ্ন বাংলায় জিজ্ঞাসা করতে পারেন।",
    presets: [
      "ধানের ব্লাস্ট রোগ ও বাদামি পাতা ফড়িং দমনে কী করণীয়?",
      "পেঁয়াজের পাতা ঝলসানো রোগ এবং টমেটোর ধসা রোগের জৈব প্রতিকার কী?",
      "বর্তমান মাটির আর্দ্রতার ভিত্তিতে গম ও ধানে কখন জলসেচ দিতে হবে?",
      "নারকেল গাছে বর্ষাকালে কুঁড়ি পচা রোগ প্রতিরোধের উপায় কী?",
    ],
    fallbackReply: "নমস্কার! জমিতে জল জমতে দেবেন না। ছত্রাকজনিত রোগের জন্য ট্রাইকোডার্মা ভিরিডি বা ১% বোর্দো মিশ্রণ স্প্রে করুন।",
  },
  pa: {
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ ਕਿਸਾਨ AI ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਤੁਪਕਾ ਸਿੰਚਾਈ, ਮਿੱਟੀ ਦੀ ਨਮੀ, ਕਣਕ, ਝੋਨਾ, ਕਪਾਹ, ਗੰਨਾ ਅਤੇ ਟਮਾਟਰ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਤੇ ਖਾਦਾਂ ਬਾਰੇ ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛ ਸਕਦੇ ਹੋ।",
    presets: [
      "ਕਣਕ ਵਿੱਚ ਪੀਲੇ ਰਤੂਏ ਅਤੇ ਝੋਨੇ ਵਿੱਚ ਝੁਲਸ ਰੋਗ ਦੀ ਰੋਕਥਾਮ ਕਿਵੇਂ ਕਰੀਏ?",
      "ਨਰਮੇ/ਕਪਾਹ ਵਿੱਚ ਗੁਲਾਬੀ ਸੁੰਡੀ ਦੇ ਹਮਲੇ ਤੋਂ ਬਚਾਅ ਲਈ ਜੈਵਿਕ ਤਰੀਕਾ ਕੀ ਹੈ?",
      "ਮਿੱਟੀ ਦੀ ਨਮੀ ਦੇ ਹਿਸਾਬ ਨਾਲ ਫ਼ਸਲ ਨੂੰ ਪਾਣੀ ਕਦੋਂ ਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
      "ਟਮਾਟਰ ਅਤੇ ਪਿਆਜ਼ ਦੀ ਫ਼ਸਲ ਲਈ ਤੁਪਕਾ ਸਿੰਚਾਈ ਦਾ ਸਹੀ ਸਮਾਂ ਕੀ ਹੈ?",
    ],
    fallbackReply: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਖੇਤ ਵਿੱਚ ਵਾਧੂ ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਹੋਣ ਦਿਓ। ਉੱਲੀ ਵਾਲੇ ਰੋਗਾਂ ਲਈ ਟ੍ਰਾਈਕੋਡਰਮਾ ਜਾਂ 1% ਬੋਰਡੋ ਮਿਸ਼ਰਣ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
  },
};
