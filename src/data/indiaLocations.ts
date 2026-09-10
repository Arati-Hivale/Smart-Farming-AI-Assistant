export interface DistrictInfo {
  id: string;
  name: string;
  majorCrops: string[];
  soilTypes: string[];
  climateZone: string;
}

export interface StateInfo {
  id: string;
  name: string;
  districts: DistrictInfo[];
}

export const INDIAN_STATES: StateInfo[] = [
  {
    id: "maharashtra",
    name: "Maharashtra",
    districts: [
      { id: "nashik", name: "Nashik", majorCrops: ["Onion", "Tomato", "Grapes", "Soybean"], soilTypes: ["Black Cotton Soil", "Red Loamy"], climateZone: "Semi-Arid Tropical" },
      { id: "pune", name: "Pune", majorCrops: ["Sugarcane", "Pomegranate", "Onion", "Vegetables"], soilTypes: ["Black Soil", "Clay Loam"], climateZone: "Western Ghats Rain Shadow" },
      { id: "ratnagiri", name: "Ratnagiri", majorCrops: ["Coconut", "Cashew", "Mango", "Rice"], soilTypes: ["Laterite Soil", "Coastal Alluvium"], climateZone: "Konkan Humid Coastal" },
      { id: "kolhapur", name: "Kolhapur", majorCrops: ["Sugarcane", "Soybean", "Rice"], soilTypes: ["Rich Deep Black", "Lateritic"], climateZone: "Sub-Humid" },
      { id: "ahmednagar", name: "Ahmednagar", majorCrops: ["Onion", "Sugarcane", "Cotton", "Millets"], soilTypes: ["Medium Black", "Sandy Loam"], climateZone: "Drought-Prone Plateau" },
      { id: "nagpur", name: "Nagpur", majorCrops: ["Cotton", "Soybean", "Orange", "Pigeon Pea"], soilTypes: ["Deep Black Regur"], climateZone: "Vidarbha Dry Sub-Humid" },
      { id: "solapur", name: "Solapur", majorCrops: ["Pomegranate", "Sugarcane", "Onion", "Jowar"], soilTypes: ["Shallow Black", "Medium Black"], climateZone: "Arid Plateau" },
    ],
  },
  {
    id: "kerala",
    name: "Kerala",
    districts: [
      { id: "wayanad", name: "Wayanad", majorCrops: ["Cardamom", "Black Pepper", "Coffee", "Tea"], soilTypes: ["Laterite Soil", "Forest Humus Loam"], climateZone: "Highland Tropical Wet" },
      { id: "idukki", name: "Idukki", majorCrops: ["Cardamom", "Black Pepper", "Clove", "Nutmeg"], soilTypes: ["Hill Loam", "Red Lateritic"], climateZone: "High Range Montane" },
      { id: "palakkad", name: "Palakkad", majorCrops: ["Rice / Paddy", "Coconut", "Vegetables"], soilTypes: ["Alluvial", "Black Soil Belt"], climateZone: "Palakkad Gap Tropical" },
      { id: "kozhikode", name: "Kozhikode", majorCrops: ["Coconut", "Arecanut", "Pepper"], soilTypes: ["Coastal Sandy Loam", "Laterite"], climateZone: "Malabar Humid" },
      { id: "kottayam", name: "Kottayam", majorCrops: ["Rubber", "Pepper", "Coconut"], soilTypes: ["Acid Laterite"], climateZone: "High Rainfall Basin" },
    ],
  },
  {
    id: "punjab",
    name: "Punjab",
    districts: [
      { id: "ludhiana", name: "Ludhiana", majorCrops: ["Wheat", "Rice / Paddy", "Maize", "Cotton"], soilTypes: ["Alluvial Loam", "Clayey Loam"], climateZone: "Indo-Gangetic Plain" },
      { id: "bhatinda", name: "Bathinda", majorCrops: ["Cotton", "Wheat", "Mustard"], soilTypes: ["Sandy Loam", "Sierozem"], climateZone: "Semi-Arid Malwa" },
      { id: "amritsar", name: "Amritsar", majorCrops: ["Wheat", "Basmati Rice", "Vegetables"], soilTypes: ["Rich Alluvium"], climateZone: "Northern Plains Sub-Tropical" },
      { id: "jalandhar", name: "Jalandhar", majorCrops: ["Potato", "Wheat", "Maize"], soilTypes: ["Fine Loamy Alluvial"], climateZone: "Doaba Belt" },
    ],
  },
  {
    id: "karnataka",
    name: "Karnataka",
    districts: [
      { id: "mandya", name: "Mandya", majorCrops: ["Sugarcane", "Rice / Paddy", "Ragi"], soilTypes: ["Red Sandy Loam", "Clay Loam"], climateZone: "Cauvery Basin" },
      { id: "shimoga", name: "Shivamogga", majorCrops: ["Arecanut", "Paddy", "Ginger", "Pepper"], soilTypes: ["Laterite", "Red Loam"], climateZone: "Malenadu Wet" },
      { id: "dharwad", name: "Dharwad", majorCrops: ["Soybean", "Cotton", "Onion", "Chilli"], soilTypes: ["Medium to Deep Black"], climateZone: "North Karnataka Transition" },
      { id: "belagavi", name: "Belagavi", majorCrops: ["Sugarcane", "Soybean", "Vegetables"], soilTypes: ["Black Soil", "Red Sandy"], climateZone: "Sub-Humid Semi-Arid" },
    ],
  },
  {
    id: "tamil_nadu",
    name: "Tamil Nadu",
    districts: [
      { id: "coimbatore", name: "Coimbatore", majorCrops: ["Cotton", "Coconut", "Tomato", "Maize"], soilTypes: ["Red Loam", "Black Soil"], climateZone: "Kongu Region Semi-Arid" },
      { id: "thanjavur", name: "Thanjavur", majorCrops: ["Rice / Paddy", "Coconut", "Pulses"], soilTypes: ["Cauvery Alluvium"], climateZone: "Delta Tropical Coastal" },
      { id: "salem", name: "Salem", majorCrops: ["Tapioca", "Tomato", "Mango", "Cotton"], soilTypes: ["Red Soil", "Gravelly Loam"], climateZone: "Dry Sub-Tropical" },
      { id: "madurai", name: "Madurai", majorCrops: ["Rice", "Cotton", "Jasmine", "Millets"], soilTypes: ["Black Soil", "Red Loam"], climateZone: "Southern Semi-Arid" },
    ],
  },
  {
    id: "andhra_pradesh",
    name: "Andhra Pradesh",
    districts: [
      { id: "guntur", name: "Guntur", majorCrops: ["Chilli", "Cotton", "Paddy", "Tobacco"], soilTypes: ["Deep Black Clayey", "Coastal Alluvium"], climateZone: "Krishna Coastal Basin" },
      { id: "kurnool", name: "Kurnool", majorCrops: ["Cotton", "Onion", "Groundnut", "Sunflower"], soilTypes: ["Black Cotton", "Red Sandy"], climateZone: "Rayalaseema Semi-Arid" },
      { id: "east_godavari", name: "East Godavari", majorCrops: ["Paddy", "Coconut", "Oil Palm"], soilTypes: ["Deltaic Alluvium"], climateZone: "Godavari Humid Delta" },
    ],
  },
  {
    id: "telangana",
    name: "Telangana",
    districts: [
      { id: "warangal", name: "Warangal", majorCrops: ["Cotton", "Chilli", "Rice / Paddy", "Maize"], soilTypes: ["Red Sandy Loam (Chalka)", "Black Cotton"], climateZone: "Deccan Semi-Arid" },
      { id: "karimnagar", name: "Karimnagar", majorCrops: ["Paddy", "Cotton", "Maize"], soilTypes: ["Black Soil", "Red Loamy"], climateZone: "Godavari Basin Tropical" },
      { id: "nizamabad", name: "Nizamabad", majorCrops: ["Soybean", "Turmeric", "Paddy"], soilTypes: ["Black Soil (Regur)"], climateZone: "Northern Plateau" },
    ],
  },
  {
    id: "gujarat",
    name: "Gujarat",
    districts: [
      { id: "rajkot", name: "Rajkot", majorCrops: ["Groundnut", "Cotton", "Onion", "Sesame"], soilTypes: ["Medium Black", "Sandy Alluvial"], climateZone: "Saurashtra Semi-Arid" },
      { id: "surat", name: "Surat", majorCrops: ["Sugarcane", "Paddy", "Banana", "Vegetables"], soilTypes: ["Deep Black Clay"], climateZone: "South Gujarat Humid" },
      { id: "anand", name: "Anand", majorCrops: ["Tobacco", "Potato", "Tomato", "Wheat"], soilTypes: ["Goradu (Sandy Loam)"], climateZone: "Charotar Fertile Belt" },
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    districts: [
      { id: "jaipur", name: "Jaipur", majorCrops: ["Mustard", "Wheat", "Bajra", "Barley"], soilTypes: ["Sandy Loam", "Alluvial"], climateZone: "Semi-Arid Eastern" },
      { id: "ganganagar", name: "Sri Ganganagar", majorCrops: ["Cotton", "Wheat", "Kinnow", "Mustard"], soilTypes: ["Canal Irrigated Alluvium"], climateZone: "Thar Canal Oasis" },
      { id: "kota", name: "Kota", majorCrops: ["Soybean", "Wheat", "Coriander", "Mustard"], soilTypes: ["Deep Black Soil"], climateZone: "Hadoti Plateau" },
    ],
  },
  {
    id: "haryana",
    name: "Haryana",
    districts: [
      { id: "karnal", name: "Karnal", majorCrops: ["Basmati Rice", "Wheat", "Sugarcane"], soilTypes: ["Loamy Alluvium"], climateZone: "Indo-Gangetic Fertile" },
      { id: "hisar", name: "Hisar", majorCrops: ["Cotton", "Wheat", "Mustard", "Guar"], soilTypes: ["Light Sandy Loam"], climateZone: "Semi-Arid Sandy" },
    ],
  },
  {
    id: "uttar_pradesh",
    name: "Uttar Pradesh",
    districts: [
      { id: "meerut", name: "Meerut", majorCrops: ["Sugarcane", "Wheat", "Potato", "Mustard"], soilTypes: ["Deep Loamy Alluvium"], climateZone: "Western UP Fertile Plains" },
      { id: "varanasi", name: "Varanasi", majorCrops: ["Rice / Paddy", "Wheat", "Vegetables"], soilTypes: ["Ganga Alluvial Loam"], climateZone: "Eastern Gangetic Sub-Humid" },
      { id: "agra", name: "Agra", majorCrops: ["Potato", "Mustard", "Bajra"], soilTypes: ["Sandy Loam"], climateZone: "Yamuna Ravines Arid" },
    ],
  },
  {
    id: "madhya_pradesh",
    name: "Madhya Pradesh",
    districts: [
      { id: "indore", name: "Indore", majorCrops: ["Soybean", "Wheat", "Garlic", "Onion"], soilTypes: ["Deep Malwa Black Soil"], climateZone: "Malwa Plateau Sub-Humid" },
      { id: "jabalpur", name: "Jabalpur", majorCrops: ["Gram (Chickpea)", "Wheat", "Paddy"], soilTypes: ["Black Clayey Loam"], climateZone: "Narmada Valley" },
    ],
  },
  {
    id: "west_bengal",
    name: "West Bengal",
    districts: [
      { id: "nadia", name: "Nadia", majorCrops: ["Rice / Paddy", "Jute", "Vegetables", "Mustard"], soilTypes: ["New Alluvial (Entisol)"], climateZone: "Gangetic Wet Delta" },
      { id: "burdwan", name: "Purba Bardhaman", majorCrops: ["Rice (Aman / Boro)", "Potato", "Mustard"], soilTypes: ["Clayey Alluvium"], climateZone: "Rice Bowl Sub-Humid" },
    ],
  },
  {
    id: "bihar",
    name: "Bihar",
    districts: [
      { id: "patna", name: "Patna", majorCrops: ["Paddy", "Wheat", "Maize", "Pulses"], soilTypes: ["Old Gangetic Alluvium"], climateZone: "Middle Gangetic Plain" },
      { id: "muzaffarpur", name: "Muzaffarpur", majorCrops: ["Litchi", "Maize", "Rice", "Wheat"], soilTypes: ["Calcareous Alluvial"], climateZone: "Sub-Himalayan Wet" },
    ],
  },
  {
    id: "odisha",
    name: "Odisha",
    districts: [
      { id: "cuttack", name: "Cuttack", majorCrops: ["Rice / Paddy", "Pulses", "Vegetables"], soilTypes: ["Mahanadi Delta Alluvium"], climateZone: "Coastal Humid" },
      { id: "sambalpur", name: "Sambalpur", majorCrops: ["Rice", "Sugarcane", "Vegetables"], soilTypes: ["Red and Yellow Soil"], climateZone: "Hirakud Canal Basin" },
    ],
  },
  {
    id: "assam",
    name: "Assam",
    districts: [
      { id: "nagaon", name: "Nagaon", majorCrops: ["Tea", "Rice / Paddy", "Jute", "Mustard"], soilTypes: ["Acidic Alluvium", "Red River Loam"], climateZone: "Brahmaputra Valley Wet" },
      { id: "kamrup", name: "Kamrup", majorCrops: ["Paddy", "Vegetables", "Ginger", "Banana"], soilTypes: ["Alluvial Sand-Clay"], climateZone: "Humid Sub-Tropical" },
    ],
  },
];

export const COMMON_SOIL_TYPES = [
  "Black Cotton Soil (Regur)",
  "Red Loamy Soil",
  "Alluvial Loam",
  "Laterite Soil",
  "Sandy Loam",
  "Clayey Loam",
  "Silt Loam",
  "Saline / Coastal Alluvium",
];

export const SOIL_TYPES = COMMON_SOIL_TYPES;

export const IRRIGATION_METHODS = [
  "Automated Drip Irrigation",
  "Micro-Sprinkler",
  "Furrow / Ridge Irrigation",
  "Basin Flooding",
  "Rainfed with Supplemental Drip",
  "Center Pivot / Raingun",
];

export const WATER_SOURCES = [
  "Deep Borewell (Tube-well)",
  "Open Agricultural Well",
  "Canal Supply Link",
  "Farm Pond (Shet-tale)",
  "River / Stream Lift Irrigation",
  "Rainwater Harvesting Reservoir",
];

export const GROWTH_STAGES = [
  "Germination / Nursery",
  "Vegetative",
  "Flowering",
  "Fruiting / Pod Formation",
  "Maturity",
  "Harvesting",
];

export const ALL_CROPS = [
  { id: "coconut", name: "Coconut", vernacular: "नारियल / തേങ്ങ" },
  { id: "pepper", name: "Black Pepper", vernacular: "काली मिर्च / കുരുമുളക്" },
  { id: "cardamom", name: "Cardamom", vernacular: "इलायची / ഏലം" },
  { id: "onion", name: "Onion", vernacular: "कांदा / प्याज" },
  { id: "tomato", name: "Tomato", vernacular: "टोमॅटो / टमाटर" },
  { id: "sugarcane", name: "Sugarcane", vernacular: "ऊस / गन्ना" },
  { id: "cotton", name: "Bt Cotton", vernacular: "कापूस / कपास" },
  { id: "wheat", name: "Wheat", vernacular: "गहू / गेहूं" },
  { id: "rice", name: "Paddy / Rice", vernacular: "भात / धान" },
  { id: "soybean", name: "Soybean", vernacular: "सोयाबीन" },
];

