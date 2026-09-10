import { FarmerUser, FarmerField, IrrigationRecord, FarmUpdate, DailyFarmRecommendation } from "../src/types";
import { DEMO_FARMERS } from "../src/data/demoFarmers";
import { INDIAN_STATES } from "../src/data/indiaLocations";

// In-memory store initialized with deep clones of the demo farmers
const farmersMap = new Map<string, FarmerUser>();

// Initialize with demo farmers
DEMO_FARMERS.forEach((farmer) => {
  farmersMap.set(farmer.id, JSON.parse(JSON.stringify(farmer)));
});

export function getAllDemoFarmers(): FarmerUser[] {
  return Array.from(farmersMap.values()).filter((f) => f.isDemo);
}

export function getFarmerById(id: string): FarmerUser | null {
  const farmer = farmersMap.get(id);
  if (!farmer) return null;
  return JSON.parse(JSON.stringify(farmer));
}

export function findFarmerByUsernameOrMobile(query: string): FarmerUser | null {
  const normalized = query.trim().toLowerCase();
  for (const farmer of farmersMap.values()) {
    if (
      farmer.username.toLowerCase() === normalized ||
      farmer.profile.mobile.replace(/\s+/g, "").includes(normalized) ||
      farmer.id === normalized
    ) {
      return JSON.parse(JSON.stringify(farmer));
    }
  }
  return null;
}

export function createFarmerAccount(params: {
  name: string;
  mobile: string;
  preferredLanguage: any;
  password?: string;
}): FarmerUser {
  const id = `farmer-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const username = params.name.toLowerCase().replace(/\s+/g, ".") + `.${Math.floor(Math.random() * 100)}`;

  const newFarmer: FarmerUser = {
    id,
    username,
    isDemo: false,
    profile: {
      id,
      name: params.name,
      mobile: params.mobile,
      preferredLanguage: params.preferredLanguage || "en",
      createdAt: new Date().toISOString(),
    },
    farm: {
      state: "Maharashtra",
      district: "Nashik",
      village: "",
      farmLocation: "",
      farmSizeAcres: 3.0,
      soilType: "Black Cotton Soil (Regur)",
      irrigationMethod: "Automated Drip Irrigation",
      waterSource: "Deep Borewell (Tube-well)",
      isConfigured: false, // will trigger Onboarding Wizard!
      waterSavedThisMonthLiters: 0,
    },
    fields: [],
    irrigationRecords: [],
    farmUpdates: [
      {
        id: `upd-${Date.now()}`,
        type: "general",
        title: "Account Created",
        description: `Welcome ${params.name}! Complete your farm profile to get personalized AI advisory.`,
        date: "Today",
        timestamp: new Date().toISOString(),
      },
    ],
  };

  farmersMap.set(id, newFarmer);
  return JSON.parse(JSON.stringify(newFarmer));
}

export function updateFarmDetails(farmerId: string, farmDetails: any): FarmerUser | null {
  const farmer = farmersMap.get(farmerId);
  if (!farmer) return null;

  farmer.farm = {
    ...farmer.farm,
    ...farmDetails,
    isConfigured: true,
  };

  // Add a journal update
  farmer.farmUpdates.unshift({
    id: `upd-${Date.now()}`,
    type: "general",
    title: "Farm Information Updated",
    description: `Configured farm at ${farmer.farm.village || farmer.farm.district}, ${farmer.farm.state} (${farmer.farm.farmSizeAcres} Acres).`,
    date: "Today",
    timestamp: new Date().toISOString(),
  });

  return JSON.parse(JSON.stringify(farmer));
}

export function updateFarmerProfile(farmerId: string, profileDetails: any): FarmerUser | null {
  const farmer = farmersMap.get(farmerId);
  if (!farmer) return null;

  farmer.profile = {
    ...farmer.profile,
    ...profileDetails,
  };

  return JSON.parse(JSON.stringify(farmer));
}

export function addFieldToFarmer(farmerId: string, fieldData: Omit<FarmerField, "id">): FarmerUser | null {
  const farmer = farmersMap.get(farmerId);
  if (!farmer) return null;

  const newFieldId = `field-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newField: FarmerField = {
    ...fieldData,
    id: newFieldId,
    waterUsedTodayLiters: fieldData.waterUsedTodayLiters || 0,
    waterUsedThisWeekLiters: fieldData.waterUsedThisWeekLiters || 0,
    lastIrrigated: fieldData.lastIrrigated || "Never recorded",
    pumpStatus: "OFF",
  };

  farmer.fields.push(newField);

  farmer.farmUpdates.unshift({
    id: `upd-${Date.now()}`,
    type: "crop_growth",
    title: `New Field Added: ${newField.name}`,
    description: `Added ${newField.areaAcres} acres of ${newField.cropDisplayName || newField.crop} in ${newField.growthStage} stage.`,
    fieldId: newField.id,
    fieldName: newField.name,
    crop: newField.crop,
    date: "Today",
    timestamp: new Date().toISOString(),
  });

  return JSON.parse(JSON.stringify(farmer));
}

export function updateField(farmerId: string, fieldId: string, updates: Partial<FarmerField>): FarmerUser | null {
  const farmer = farmersMap.get(farmerId);
  if (!farmer) return null;

  const fieldIndex = farmer.fields.findIndex((f) => f.id === fieldId);
  if (fieldIndex === -1) return null;

  const oldField = farmer.fields[fieldIndex];
  const updatedField = {
    ...oldField,
    ...updates,
  };

  farmer.fields[fieldIndex] = updatedField;

  // If moisture was updated manually, add a brief note
  if (updates.soilMoisturePercent !== undefined && updates.soilMoisturePercent !== oldField.soilMoisturePercent) {
    farmer.farmUpdates.unshift({
      id: `upd-${Date.now()}`,
      type: "general",
      title: `Soil moisture updated for ${updatedField.name}`,
      description: `Moisture level adjusted from ${oldField.soilMoisturePercent}% to ${updates.soilMoisturePercent}%.`,
      fieldId: updatedField.id,
      fieldName: updatedField.name,
      crop: updatedField.crop,
      date: "Today",
      timestamp: new Date().toISOString(),
    });
  }

  return JSON.parse(JSON.stringify(farmer));
}

export function deleteField(farmerId: string, fieldId: string): FarmerUser | null {
  const farmer = farmersMap.get(farmerId);
  if (!farmer) return null;

  const removed = farmer.fields.find((f) => f.id === fieldId);
  farmer.fields = farmer.fields.filter((f) => f.id !== fieldId);

  if (removed) {
    farmer.farmUpdates.unshift({
      id: `upd-${Date.now()}`,
      type: "general",
      title: `Field Removed: ${removed.name}`,
      description: `Removed field from farm monitoring records.`,
      date: "Today",
      timestamp: new Date().toISOString(),
    });
  }

  return JSON.parse(JSON.stringify(farmer));
}

export function recordIrrigation(
  farmerId: string,
  record: {
    fieldId: string;
    amountLiters: number;
    durationMinutes: number;
    method: string;
    notes?: string;
  }
): FarmerUser | null {
  const farmer = farmersMap.get(farmerId);
  if (!farmer) return null;

  const field = farmer.fields.find((f) => f.id === record.fieldId);
  const fieldName = field ? field.name : "Unassigned Field";
  const crop = field ? field.cropDisplayName || field.crop : "Crops";

  // Calculate simulated water saving if optimized
  const savedLiters = Math.round(record.amountLiters * 0.28);

  const newRecord: IrrigationRecord = {
    id: `irr-${Date.now()}`,
    fieldId: record.fieldId,
    fieldName,
    crop,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    durationMinutes: record.durationMinutes,
    amountLiters: record.amountLiters,
    method: record.method || "Drip",
    savedEstimateLiters: savedLiters,
    notes: record.notes,
  };

  farmer.irrigationRecords.unshift(newRecord);

  // Update the field moisture and stats
  if (field) {
    field.waterUsedTodayLiters += record.amountLiters;
    field.waterUsedThisWeekLiters += record.amountLiters;
    field.lastIrrigated = "Today, " + newRecord.time;
    // Moisture bump based on water applied
    field.soilMoisturePercent = Math.min(85, field.soilMoisturePercent + Math.min(30, Math.round(record.amountLiters / 80)));
    if (field.soilMoisturePercent > 45 && field.soilMoisturePercent <= 75) {
      field.cropHealthStatus = "Good";
    }
  }

  farmer.farmUpdates.unshift({
    id: `upd-${Date.now()}`,
    type: "irrigation",
    title: `Irrigated ${fieldName}`,
    description: `Delivered ${record.amountLiters.toLocaleString()} L via ${record.method || "Drip"} (${record.durationMinutes} mins). Est. water saved: ${savedLiters} L.`,
    fieldId: record.fieldId,
    fieldName,
    crop,
    date: "Today",
    timestamp: new Date().toISOString(),
  });

  return JSON.parse(JSON.stringify(farmer));
}

export function addFarmUpdate(farmerId: string, updateData: Omit<FarmUpdate, "id" | "timestamp">): FarmerUser | null {
  const farmer = farmersMap.get(farmerId);
  if (!farmer) return null;

  const newUpdate: FarmUpdate = {
    ...updateData,
    id: `upd-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  farmer.farmUpdates.unshift(newUpdate);
  return JSON.parse(JSON.stringify(farmer));
}

// Generate Personalized Daily Farm Recommendations (Section 6)
export function generateDailyRecommendations(farmer: FarmerUser, weather: any): DailyFarmRecommendation[] {
  const recs: DailyFarmRecommendation[] = [];
  const fields = farmer.fields;

  // 1. 💧 Irrigation Recommendation
  const dryField = fields.find((f) => f.soilMoisturePercent < 35);
  const optimalField = fields.find((f) => f.soilMoisturePercent >= 35 && f.soilMoisturePercent < 70);
  const rainExpected = weather && weather.rainfallChancePercent >= 50;

  if (dryField) {
    if (rainExpected) {
      recs.push({
        id: `rec-irrigation-delay-${dryField.id}`,
        type: "irrigation",
        category: "irrigation",
        iconType: "water",
        title: "Irrigation Delay Recommended",
        message: `${dryField.name} soil moisture is at ${dryField.soilMoisturePercent}%, but ${weather.rainfallChancePercent}% rain is forecast. Delay irrigation by 24h to save up to 1,200 L of water.`,
        description: `${dryField.name} soil moisture is at ${dryField.soilMoisturePercent}%, but ${weather.rainfallChancePercent}% rain is forecast. Delay irrigation by 24h to save water.`,
        actionText: "Hold Scheduled Irrigation Cycle",
        optimalTime: "Postpone to tomorrow evening",
        waterSavedEstimateLiters: 1200,
        urgency: "medium",
        priority: "medium",
        fieldId: dryField.id,
        fieldName: dryField.name,
      });
    } else {
      recs.push({
        id: `rec-irrigation-req-${dryField.id}`,
        type: "irrigation",
        category: "irrigation",
        iconType: "water",
        title: "Irrigation Required",
        message: `${dryField.name} soil moisture has dropped to ${dryField.soilMoisturePercent}%. Run ${dryField.irrigationMethod} for 35-45 minutes during early morning hours.`,
        description: `${dryField.name} soil moisture has dropped to ${dryField.soilMoisturePercent}%. Run ${dryField.irrigationMethod} for 35-45 minutes.`,
        actionText: `Run ${dryField.irrigationMethod} for 40 mins`,
        optimalTime: "05:30 AM – 07:30 AM",
        waterSavedEstimateLiters: 450,
        urgency: "urgent",
        priority: "high",
        fieldId: dryField.id,
        fieldName: dryField.name,
      });
    }
  } else if (optimalField) {
    recs.push({
      id: `rec-irrigation-opt-${optimalField.id}`,
      type: "irrigation",
      category: "irrigation",
      iconType: "water",
      title: "Optimal Soil Moisture Maintained",
      message: `Moisture in ${optimalField.name} is well balanced at ${optimalField.soilMoisturePercent}%. No irrigation needed today.`,
      description: `Moisture in ${optimalField.name} is well balanced at ${optimalField.soilMoisturePercent}%. No irrigation needed today.`,
      actionText: "Keep Solenoid Valves Closed",
      optimalTime: "Check moisture sensor at 06:00 PM",
      waterSavedEstimateLiters: 900,
      urgency: "optimal",
      priority: "info",
      fieldId: optimalField.id,
      fieldName: optimalField.name,
    });
  } else {
    recs.push({
      id: "rec-irrigation-monitor-general",
      type: "irrigation",
      category: "irrigation",
      iconType: "water",
      title: "Monitor Root Zone Moisture",
      message: "Check soil moisture levels regularly across fields to avoid unnecessary pumping.",
      description: "Check soil moisture levels regularly across fields to avoid unnecessary pumping.",
      actionText: "Inspect root depth moisture with probe",
      optimalTime: "Early Morning (06:00 AM – 08:00 AM)",
      urgency: "low",
      priority: "info",
    });
  }

  // 2. 🌧 Weather Recommendation
  if (rainExpected) {
    recs.push({
      id: "rec-weather-rain-warning",
      type: "weather",
      category: "weather",
      iconType: "cloud",
      title: "Rain Expected in Next 24 Hours",
      message: `${weather.rainfallChancePercent}% chance of rain in ${farmer.farm.district || farmer.farm.state}. Postpone pesticide dusting and bio-fertilizer spraying to prevent wash-off.`,
      description: `${weather.rainfallChancePercent}% chance of rain in ${farmer.farm.district || farmer.farm.state}. Postpone chemical spraying.`,
      actionText: "Postpone Foliar & Dust Applications",
      optimalTime: "Resume after rain clearing",
      urgency: "high",
      priority: "high",
    });
  } else {
    recs.push({
      id: "rec-weather-favorable-window",
      type: "weather",
      category: "weather",
      iconType: "cloud",
      title: "Favorable Spraying & Field Window",
      message: `Clear conditions with ${weather ? weather.tempC : 28}°C in ${farmer.farm.district || farmer.farm.state}. Good window for foliar nutrient sprays and weed control.`,
      description: `Clear conditions with ${weather ? weather.tempC : 28}°C in ${farmer.farm.district || farmer.farm.state}. Good spraying window.`,
      actionText: "Proceed with Scheduled Foliar Feeding",
      optimalTime: "07:00 AM – 10:00 AM or 04:30 PM",
      urgency: "optimal",
      priority: "info",
    });
  }

  // 3. 🌱 Crop Growth Recommendation
  const floweringCrop = fields.find((f) => f.growthStage === "Flowering");
  const vegetativeCrop = fields.find((f) => f.growthStage === "Vegetative");
  if (floweringCrop) {
    recs.push({
      id: `rec-growth-flowering-${floweringCrop.id}`,
      type: "growth",
      category: "growth",
      iconType: "sprout",
      title: "Flowering Stage Water Management",
      message: `Your ${floweringCrop.cropDisplayName || floweringCrop.crop} in ${floweringCrop.name} is in critical flowering stage. Avoid severe moisture fluctuations to prevent flower drop.`,
      description: `Your ${floweringCrop.cropDisplayName || floweringCrop.crop} in ${floweringCrop.name} is flowering. Avoid moisture shocks.`,
      actionText: "Maintain Stable Canopy Humidity",
      optimalTime: "Maintain regular pulse irrigation",
      urgency: "medium",
      priority: "medium",
      fieldId: floweringCrop.id,
      fieldName: floweringCrop.name,
    });
  } else if (vegetativeCrop) {
    recs.push({
      id: `rec-growth-veg-${vegetativeCrop.id}`,
      type: "growth",
      category: "growth",
      iconType: "sprout",
      title: "Vegetative Growth Vigor",
      message: `${vegetativeCrop.name} is actively producing canopy. Ensure adequate nitrogen and phosphorus availability in root zone.`,
      description: `${vegetativeCrop.name} is actively producing canopy. Ensure nutrient availability in root zone.`,
      actionText: "Check Leaf Greenness & Node Spacing",
      optimalTime: "Mid-day scouting",
      urgency: "low",
      priority: "info",
      fieldId: vegetativeCrop.id,
      fieldName: vegetativeCrop.name,
    });
  } else {
    recs.push({
      id: "rec-growth-general-monitoring",
      type: "growth",
      category: "growth",
      iconType: "sprout",
      title: "Seasonal Crop Monitoring",
      message: "Monitor vegetative emergence and note dates in the Farm Updates journal to track maturity.",
      description: "Monitor vegetative emergence and note dates in the Farm Updates journal to track maturity.",
      actionText: "Log Weekly Growth Milestones",
      urgency: "low",
      priority: "info",
    });
  }

  // 4. 🐛 Crop Health Recommendation
  const stressedField = fields.find((f) => f.cropHealthStatus === "Stressed" || f.cropHealthStatus === "Diseased");
  if (stressedField) {
    recs.push({
      id: `rec-health-stressed-${stressedField.id}`,
      type: "disease",
      category: "health",
      iconType: "bug",
      title: "Inspect Foliage & Upload Photo",
      message: `${stressedField.name} is flagged as ${stressedField.cropHealthStatus}. Take a close-up picture of affected leaves and scan with Crop Doctor for immediate remedy.`,
      description: `${stressedField.name} is flagged as ${stressedField.cropHealthStatus}. Take a leaf picture and diagnose with Crop Doctor.`,
      actionText: "Scan Leaf via AI Crop Doctor",
      optimalTime: "Immediate daytime inspection",
      urgency: "urgent",
      priority: "high",
      fieldId: stressedField.id,
      fieldName: stressedField.name,
    });
  } else {
    recs.push({
      id: "rec-health-preventive-scout",
      type: "disease",
      category: "health",
      iconType: "bug",
      title: "Preventive Scouting",
      message: "Crop foliage appears healthy. Upload a leaf image immediately if you notice yellowing, spots, or wilt.",
      description: "Crop foliage appears healthy across all monitored plots. Regular scouting recommended.",
      actionText: "Perform Morning Walk-through",
      optimalTime: "08:00 AM – 09:30 AM",
      urgency: "optimal",
      priority: "info",
    });
  }

  // 5. 💰 Productivity Recommendation
  const totalWaterSaved = farmer.irrigationRecords.reduce((acc, r) => acc + (r.savedEstimateLiters || 0), 0);
  recs.push({
    id: "rec-productivity-water-conservation",
    type: "productivity",
    category: "productivity",
    iconType: "trending",
    title: "Productivity & Resource Conservation",
    message: `Smart scheduling has helped conserve approximately ${totalWaterSaved > 0 ? totalWaterSaved.toLocaleString() : "2,400"} Liters of water this season. Maintain optimal timing to reduce avoidable plant stress.`,
    description: `Smart scheduling has saved ${totalWaterSaved > 0 ? totalWaterSaved.toLocaleString() : "2,400"} Liters of water this season.`,
    actionText: "Review Weekly Water Efficiency Report",
    optimalTime: "Available 24/7 in Irrigation Tab",
    waterSavedEstimateLiters: totalWaterSaved > 0 ? totalWaterSaved : 2400,
    urgency: "low",
    priority: "info",
  });

  return recs;
}

// Dynamic Weather Generator for ANY District / State in India
export function getDynamicWeatherForLocation(district: string, state: string) {
  const normDist = (district || "nashik").trim().toLowerCase();
  const normState = (state || "maharashtra").trim().toLowerCase();

  // Check state agro-climate characteristics
  const isSouthCoast = normState.includes("kerala") || normState.includes("karnataka") || normState.includes("goa");
  const isPlains = normState.includes("punjab") || normState.includes("haryana") || normState.includes("uttar");
  const isDeccan = normState.includes("maharashtra") || normState.includes("telangana") || normState.includes("andhra") || normState.includes("madhya");
  const isEastern = normState.includes("bengal") || normState.includes("odisha") || normState.includes("bihar") || normState.includes("assam");

  const displayName = `${district.charAt(0).toUpperCase() + district.slice(1)}, ${state.charAt(0).toUpperCase() + state.slice(1)}`;

  let tempC = isPlains ? 32 : isSouthCoast ? 25 : isDeccan ? 29 : isEastern ? 30 : 28;
  let humidity = isSouthCoast ? 85 : isEastern ? 82 : isDeccan ? 60 : 50;
  let rainChance = isSouthCoast ? 70 : isEastern ? 65 : normDist.includes("nashik") ? 60 : 25;
  let condition = rainChance > 50 ? "Scattered Showers & Overcast" : rainChance > 30 ? "Partly Cloudy" : "Sunny & Warm";

  const days = ["Today", "Tomorrow", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
  const forecast = days.map((day, idx) => {
    const rChance = Math.max(10, Math.min(85, rainChance + (idx % 2 === 0 ? -15 : 10) - idx * 3));
    return {
      day,
      temp: `${tempC + (idx % 2 === 0 ? 1 : -1)}° / ${tempC - 7}°C`,
      rain: `${rChance}%`,
      icon: rChance > 50 ? "rain" : rChance > 25 ? "cloud" : "sun",
      advisory:
        rChance > 50
          ? "Potential rainfall. Postpone irrigation and chemical dusting."
          : "Favorable dry window. Suitable for weeding and scheduled fertigation.",
    };
  });

  const alerts = [];
  if (rainChance >= 60) {
    alerts.push({
      severity: "warning" as const,
      title: "Precipitation & Waterlogging Alert",
      message: `Rain probability is ${rainChance}% in ${displayName}. Ensure clearing of sub-surface drainage trenches.`,
    });
  }
  if (humidity >= 80) {
    alerts.push({
      severity: "info" as const,
      title: "Elevated Relative Humidity",
      message: `High relative humidity (${humidity}%) favors fungal foliar pathogens. Monitor sensitive vegetable crops.`,
    });
  }

  return {
    district: displayName,
    state,
    crops: isSouthCoast
      ? ["Black Pepper", "Cardamom", "Coconut", "Rice"]
      : isPlains
      ? ["Wheat", "Rice", "Cotton", "Mustard"]
      : isDeccan
      ? ["Onion", "Soybean", "Cotton", "Sugarcane", "Tomato"]
      : ["Rice", "Jute", "Vegetables", "Mustard"],
    tempC,
    condition,
    humidityPercent: humidity,
    rainfallChancePercent: rainChance,
    windSpeedKmh: 14,
    evapotranspirationMm: isSouthCoast ? 3.4 : 4.6,
    uvIndex: 6,
    forecast,
    alerts,
  };
}
