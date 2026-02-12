import { useEffect, useState } from "react";
import { Leaf, FlaskConical, Activity } from "lucide-react";

type NPKFeed = {
  field1: string | null;
  field2: string | null;
  field3: string | null;
  created_at: string;
};

const API_URL =
  "https://api.thingspeak.com/channels/3261075/feeds.json?api_key=KXBUY52QHYSUC5SQ&results=1";

const NPKDashboard = () => {
  const [npk, setNpk] = useState<NPKFeed | null>(null);
  const [recommendedCrop, setRecommendedCrop] = useState("");

  useEffect(() => {
    fetchNPK();
    const interval = setInterval(fetchNPK, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchNPK = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (json.feeds?.length > 0) {
        const data = json.feeds[0];
        setNpk(data);

        const n = Number(data.field1 ?? 0);
        const p = Number(data.field2 ?? 0);
        const k = Number(data.field3 ?? 0);

        setRecommendedCrop(getCropSuggestion(n, p, k));
      }
    } catch (err) {
      console.error("NPK Fetch Error:", err);
    }
  };

  /* ================= SMART CROP LOGIC ================= */

  const getCropSuggestion = (n: number, p: number, k: number) => {
    // Banana – High N & K
    if (n >= 70 && k >= 70)
      return "🍌 Banana (High Nitrogen & Potassium Soil)";

    // Turmeric – Medium NPK
    if (n >= 40 && p >= 30 && k >= 40)
      return "🌿 Turmeric (Well Balanced Nutrient Soil)";

    // Garlic – Medium P & K
    if (p >= 40 && k >= 40 && n >= 30)
      return "🧄 Garlic (Good Phosphorus & Potassium Level)";

    // Corn – High Nitrogen
    if (n >= 60)
      return "🌽 Corn (High Nitrogen Soil)";

    // Beans – Moderate NPK
    if (n >= 30 && p >= 30 && k >= 30 && n <= 60)
      return "🫘 Beans (Moderate Fertile Soil)";

    // Beetroot – Medium Potassium
    if (k >= 50 && n >= 30)
      return "🥕 Beetroot (Potassium Rich Soil)";

    // Ragi – Low to Medium Nutrient
    if (n >= 20 && p >= 20 && k >= 20 && n <= 50)
      return "🌾 Ragi (Suitable for Moderate Soil)";

    // Kambu – Low Nutrient tolerantTapioca
    if (n >= 15 && p >= 15 && k >= 15)
      return "🌾 Kambu (Millet – Tolerates Low Nutrient Soil)";

    // Tapioca – High K soil
    if (k >= 60)
      return "🌱 Tapioca (High Potassium Soil Preferred)";

    return "⚠ Soil Needs Nutrient Improvement";
  };

  const nitrogen = Number(npk?.field1 ?? 0);
  const phosphorus = Number(npk?.field2 ?? 0);
  const potassium = Number(npk?.field3 ?? 0);

  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl border mt-12">
      <h2 className="text-3xl font-bold text-center text-emerald-700 mb-12">
        🌿 Smart Soil Nutrient Analysis (Hilly Region)
      </h2>

      <div className="grid md:grid-cols-3 gap-10">

        <NPKCard
          title="Nitrogen (N)"
          value={nitrogen}
          icon={<Leaf size={28} />}
          bg="bg-green-100"
          color="text-green-600"
          bar="bg-green-500"
        />

        <NPKCard
          title="Phosphorus (P)"
          value={phosphorus}
          icon={<FlaskConical size={28} />}
          bg="bg-blue-100"
          color="text-blue-600"
          bar="bg-blue-500"
        />

        <NPKCard
          title="Potassium (K)"
          value={potassium}
          icon={<Activity size={28} />}
          bg="bg-orange-100"
          color="text-orange-600"
          bar="bg-orange-500"
        />

      </div>

      {/* Crop Recommendation */}
      <div className="mt-14 bg-gradient-to-r from-emerald-100 to-green-200 p-8 rounded-2xl text-center shadow-inner">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          🌾 Recommended Crop
        </h3>
        <p className="text-2xl font-bold text-emerald-900">
          {recommendedCrop}
        </p>
      </div>
    </div>
  );
};

const NPKCard = ({
  title,
  value,
  icon,
  bg,
  color,
  bar,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
  color: string;
  bar: string;
}) => (
  <div className="bg-gray-50 rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300">
    <div className="flex items-center justify-between mb-6">
      <div className={`p-4 rounded-xl ${bg} ${color}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-gray-500">
        {value} mg/kg
      </span>
    </div>

    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      {title}
    </h3>

    <div className="w-full bg-gray-200 h-3 rounded-full">
      <div
        className={`h-3 rounded-full ${bar}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);

export default NPKDashboard;
