import { useEffect, useState } from "react";
import { Leaf, FlaskConical, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ================= TYPES ================= */

type ThingSpeakFeed = {
  field3: string | null; // NPK stored as "N,P,K"
  created_at: string;
};

/* ================= CONFIG ================= */

const API_URL =
  "https://api.thingspeak.com/channels/3232296/feeds.json?results=1";

const POLLING_INTERVAL = 15000; // ThingSpeak safe interval

/* ================= COMPONENT ================= */

const NPKDashboard = () => {
  const { t } = useTranslation();

  const [nitrogen, setNitrogen] = useState<number>(0);
  const [phosphorus, setPhosphorus] = useState<number>(0);
  const [potassium, setPotassium] = useState<number>(0);
  const [recommendedCropKey, setRecommendedCropKey] = useState<string>("");

  useEffect(() => {
    fetchNPK();
    const interval = setInterval(fetchNPK, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  /* ================= PARSE FUNCTION ================= */

  const parseNPK = (value?: string | null): [number, number, number] => {
    if (!value) return [0, 0, 0];

    const values = value.split(",").map((v) =>
      parseFloat(v.trim())
    );

    return [
      values[0] ?? 0,
      values[1] ?? 0,
      values[2] ?? 0,
    ];
  };

  /* ================= FETCH FUNCTION ================= */

  const fetchNPK = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (json.feeds?.length > 0) {
        const latest: ThingSpeakFeed = json.feeds[0];

        const [n, p, k] = parseNPK(latest.field3);

        setNitrogen(n);
        setPhosphorus(p);
        setPotassium(k);
        setRecommendedCropKey(getCropSuggestionKey(n, p, k));
      }
    } catch (error) {
      console.error("NPK Fetch Error:", error);
    }
  };

  /* ================= SMART CROP LOGIC (returns translation key) ================= */

  const getCropSuggestionKey = (n: number, p: number, k: number): string => {
    if (n >= 70 && k >= 70) return "rec_banana";

    if (n >= 40 && p >= 30 && k >= 40) return "rec_turmeric";

    if (p >= 40 && k >= 40 && n >= 30) return "rec_garlic";

    if (n >= 60) return "rec_corn";

    if (n >= 30 && p >= 30 && k >= 30 && n <= 60) return "rec_beans";

    if (k >= 50 && n >= 30) return "rec_beetroot";

    if (n >= 20 && p >= 20 && k >= 20 && n <= 50) return "rec_ragi";

    if (n >= 15 && p >= 15 && k >= 15) return "rec_kambu";

    if (k >= 60) return "rec_tapioca";

    return "rec_soil_needs_improvement";
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl border mt-12">
      <h2 className="text-3xl font-bold text-center text-emerald-700 mb-12">
        🌿 {t("soilAnalysisHilly")}
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        <NPKCard
          title={t("nitrogen")}
          value={nitrogen}
          icon={<Leaf size={28} />}
          bg="bg-green-100"
          color="text-green-600"
          bar="bg-green-500"
        />

        <NPKCard
          title={t("phosphorus")}
          value={phosphorus}
          icon={<FlaskConical size={28} />}
          bg="bg-blue-100"
          color="text-blue-600"
          bar="bg-blue-500"
        />

        <NPKCard
          title={t("potassium")}
          value={potassium}
          icon={<Activity size={28} />}
          bg="bg-orange-100"
          color="text-orange-600"
          bar="bg-orange-500"
        />
      </div>

      <div className="mt-14 bg-gradient-to-r from-emerald-100 to-green-200 p-8 rounded-2xl text-center shadow-inner">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          🌾 {t("recommendedCrop")}
        </h3>
        <p className="text-2xl font-bold text-emerald-900">
          {recommendedCropKey ? t(recommendedCropKey) : t("improveSoil")}
        </p>
      </div>
    </div>
  );
};

/* ================= CARD COMPONENT ================= */

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