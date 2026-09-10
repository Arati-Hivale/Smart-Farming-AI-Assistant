import { SampleDiseaseCase } from "../types";

// High-fidelity SVG base64 representations for quick testing
function createSvgDataUri(bg: string, mainColor: string, title: string, detailText: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}" />
        <stop offset="100%" stop-color="#1c1917" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g)" rx="16"/>
    <!-- Plant stem/leaf outline -->
    <path d="M 200 40 Q 220 150 200 260" stroke="#44403c" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M 200 100 C 130 90 100 130 110 180 C 140 180 180 140 200 120" fill="${mainColor}" opacity="0.85"/>
    <path d="M 200 140 C 270 130 300 170 290 220 C 260 220 220 180 200 160" fill="${mainColor}" opacity="0.85"/>
    <!-- Lesion / necrotic spots -->
    <circle cx="150" cy="140" r="18" fill="#78350f" opacity="0.9"/>
    <circle cx="160" cy="145" r="10" fill="#451a03" />
    <circle cx="250" cy="180" r="22" fill="#78350f" opacity="0.9"/>
    <circle cx="255" cy="185" r="14" fill="#451a03" />
    <circle cx="200" cy="190" r="12" fill="#991b1b" opacity="0.85"/>
    <!-- Labels -->
    <rect x="20" y="235" width="360" height="50" rx="8" fill="#000000" fill-opacity="0.6"/>
    <text x="35" y="258" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">${title}</text>
    <text x="35" y="275" font-family="system-ui, sans-serif" font-size="12" fill="#a8a29e">${detailText}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const sampleDiseaseCases: SampleDiseaseCase[] = [
  {
    id: "coconut-bud-rot",
    crop: "coconut",
    name: "Coconut Bud Rot (Phytophthora palmivora)",
    vernacularName: {
      en: "Coconut Bud Rot (Crown Rot)",
      hi: "नारियल का शीर्ष सड़न (Bud Rot)",
      mr: "नारळाचा शेंडा कुजणे (बड रॉट)",
      ml: "തെങ്ങിന്റെ മണ്ടയഴുകൽ രോഗം (Bud Rot)",
    },
    sampleImage: createSvgDataUri("#1e3a1e", "#84cc16", "Coconut Crown / Spindle Rot", "Phytophthora palmivora - Yellowing & rotting of central spear leaf"),
    description: "Paleness and withering of central spear leaf. Rotten tissues emit foul odor; outer whorl remains green initially.",
  },
  {
    id: "coconut-stem-bleeding",
    crop: "coconut",
    name: "Coconut Stem Bleeding (Thielaviopsis paradoxa)",
    vernacularName: {
      en: "Coconut Stem Bleeding",
      hi: "नारियल के तने से रिसाव (Stem Bleeding)",
      mr: "नारळाच्या खोडावरील तांबूस स्राव (स्टेम ब्लीडिंग)",
      ml: "തെങ്ങിന്റെ തണ്ട് ഒഴുക്ക് / ചോരയൊഴുക്ക്",
    },
    sampleImage: createSvgDataUri("#292524", "#d97706", "Coconut Trunk Cracks", "Thielaviopsis paradoxa - Dark reddish gummy liquid exudation"),
    description: "Dark reddish-brown gummy exudation leaking from cracks along the trunk, drying into dark brown crusts.",
  },
  {
    id: "pepper-quick-wilt",
    crop: "pepper",
    name: "Black Pepper Quick Wilt / Foot Rot (Phytophthora capsici)",
    vernacularName: {
      en: "Black Pepper Quick Wilt (Foot Rot)",
      hi: "काली मिर्च का द्रुत विल्ट / कॉलर रॉट",
      mr: "काळी मिरीवरील जलद मर रोग (क्विक विल्ट)",
      ml: "കുരുമുളകിന്റെ ദ്രുതവാട്ടം (Foot Rot)",
    },
    sampleImage: createSvgDataUri("#1c1917", "#15803d", "Pepper Vine Collar & Roots", "Phytophthora capsici - Sudden vine drooping & collar rot"),
    description: "Sudden drooping and total wilting of leaves within 3-5 days. Dark water-soaked lesions on collar near ground level.",
  },
  {
    id: "pepper-pollu-beetle",
    crop: "pepper",
    name: "Black Pepper Pollu Beetle (Longitarsus nigripennis)",
    vernacularName: {
      en: "Black Pepper Pollu Beetle Damage",
      hi: "काली मिर्च का पोल्लू भृंग (Pollu Beetle)",
      mr: "काळी मिरीवरील पोल्लू भुंगा उपद्रव",
      ml: "കുരുമുളകിന്റെ പൊള്ളുവണ്ട് ബാധ",
    },
    sampleImage: createSvgDataUri("#262626", "#a3e635", "Pepper Spike & Berries", "Longitarsus nigripennis - Hollow, blackened crumbling berries"),
    description: "Grubs bore into young tender spikes and berries, causing them to turn black, hollow ('pollu'), and drop off.",
  },
  {
    id: "cardamom-capsule-rot",
    crop: "cardamom",
    name: "Cardamom Capsule Rot / Azhukal (Phytophthora nicotianae)",
    vernacularName: {
      en: "Cardamom Capsule Rot (Azhukal Disease)",
      hi: "इलायची का अझुकल कैप्सूल सड़न",
      mr: "वेलचीवरील अझुकल बोंड कुजणे",
      ml: "ഏലത്തിന്റെ അഴുകൽ രോഗം (Azhukal)",
    },
    sampleImage: createSvgDataUri("#14532d", "#86efac", "Cardamom Panicle & Capsule", "Phytophthora nicotianae - Water-soaked decaying capsules"),
    description: "Water-soaked dull greenish-brown rot on growing panicles, decaying capsules shedding prematurely in high humidity.",
  },
  {
    id: "cardamom-katte-virus",
    crop: "cardamom",
    name: "Cardamom Katte Mosaic Disease (Mosaic Virus)",
    vernacularName: {
      en: "Cardamom Katte Disease (Mosaic)",
      hi: "इलायची का कट्टे मोज़ेक विषाणु रोग",
      mr: "वेलचीवरील कट्टे मोझॅक विषाणू रोग",
      ml: "ഏലത്തിന്റെ കട്ടേ രോഗം (മൊസൈക്)",
    },
    sampleImage: createSvgDataUri("#1e293b", "#4ade80", "Cardamom Leaves & Tillers", "Cardamom Mosaic Virus (CdMV) - Chlorotic vein banding"),
    description: "Continuous or broken chlorotic stripes parallel to veins on young emerging leaves. Plants become stunted with poor tiller formation.",
  },
  {
    id: "onion-purple-blotch",
    crop: "onion",
    name: "Onion Purple Blotch (Alternaria porri)",
    vernacularName: {
      en: "Onion Purple Blotch",
      hi: "प्याज का बैंगनी धब्बा रोग",
      mr: "कांद्यावरील करपा / जांभळा करपा",
    },
    sampleImage: createSvgDataUri("#3b0764", "#c084fc", "Onion Leaves & Stalks", "Alternaria porri - Sunken elliptical purple spots with yellow halos"),
    description: "Small, water-soaked lesions that turn sunken with purple centers and yellow margins, causing leaf break and bulb rot.",
  },
  {
    id: "cotton-pink-bollworm",
    crop: "cotton",
    name: "Cotton Pink Bollworm (Pectinophora gossypiella)",
    vernacularName: {
      en: "Cotton Pink Bollworm Damage",
      hi: "कपास की गुलाबी सुंडी (गुलाबी इल्ली)",
      mr: "कपाशीवरील गुलाबी बोंडअळी",
    },
    sampleImage: createSvgDataUri("#451a03", "#f97316", "Cotton Bolls & Rosette Flower", "Pectinophora gossypiella - Rosette flowers & chewed lint inside bolls"),
    description: "Caterpillars bore into flower buds and green bolls, forming rosette-like flowers and feeding on maturing cotton seeds.",
  },
  {
    id: "soybean-rust",
    crop: "soybean",
    name: "Soybean Rust (Phakopsora pachyrhizi)",
    vernacularName: {
      en: "Soybean Rust Disease",
      hi: "सोयाबीन का गेरुई / रतुआ रोग",
      mr: "सोयाबीनवरील तांबेरा रोग (रस्ट)",
    },
    sampleImage: createSvgDataUri("#78350f", "#fbbf24", "Soybean Lower Leaves", "Phakopsora pachyrhizi - Tan-brown pustules on undersides of leaves"),
    description: "Small brown-to-tan powdery pustules predominantly on lower leaf undersides, leading to early defoliation and pod abortion.",
  },
  {
    id: "sugarcane-red-rot",
    crop: "sugarcane",
    name: "Sugarcane Red Rot (Colletotrichum falcatum)",
    vernacularName: {
      en: "Sugarcane Red Rot (Cane Wilt)",
      hi: "गन्ने का लाल सड़न रोग (रेड रॉट)",
      mr: "उसाचा तांबडा कूज रोग (रेड रॉट)",
    },
    sampleImage: createSvgDataUri("#7f1d1d", "#f87171", "Sugarcane Stalk Interior", "Colletotrichum falcatum - Red pith with crosswise white patches"),
    description: "Yellowing and drying of third or fourth leaf crown, splitting the cane reveals reddened internal pith with distinct white patches and alcohol odor.",
  },
  {
    id: "tomato-early-blight",
    crop: "tomato",
    name: "Tomato Early Blight (Alternaria solani)",
    vernacularName: {
      en: "Tomato Early Blight",
      hi: "टमाटर का अगेती झुलसा (Early Blight)",
      mr: "टोमॅटोवरील लवकर येणारा करपा",
    },
    sampleImage: createSvgDataUri("#1e3a1e", "#ef4444", "Tomato Leaf Foliage", "Alternaria solani - Concentric target-board rings on leaves"),
    description: "Dark brown concentric target-like rings on older lower leaves surrounded by yellow chlorotic margins.",
  },
  {
    id: "wheat-yellow-rust",
    crop: "wheat",
    name: "Wheat Yellow / Stripe Rust (Puccinia striiformis)",
    vernacularName: {
      en: "Wheat Stripe / Yellow Rust",
      hi: "गेहूं का पीला रतुआ / पीली गेरुई",
      mr: "गव्हावरील पिवळा तांबेरा",
    },
    sampleImage: createSvgDataUri("#451a03", "#eab308", "Wheat Leaf Blades", "Puccinia striiformis - Linear yellow powdery spore stripes"),
    description: "Bright yellow-orange powdery pustules formed in parallel narrow stripes along the veins of wheat leaf blades.",
  },
  {
    id: "rice-blast",
    crop: "rice",
    name: "Rice Blast (Pyricularia oryzae)",
    vernacularName: {
      en: "Rice Leaf & Neck Blast",
      hi: "धान का झोंका रोग (ब्लास्ट)",
      mr: "भातावरील करपा / ब्लास्ट रोग",
    },
    sampleImage: createSvgDataUri("#064e3b", "#a7f3d0", "Paddy Leaf & Panicle Neck", "Pyricularia oryzae - Spindle-shaped lesions with greyish center"),
    description: "Spindle or eye-shaped lesions with ash-grey centers and dark brown borders on leaves and black necrotic rot at neck nodes.",
  },
];
