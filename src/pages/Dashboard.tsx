import { useEffect, useState } from "react";
import { Thermometer, Droplet, Sun, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loading from "./Loading";
import Node3Control from "./Node3Control";
import NPKDashboard from "./NPKDashboard";

type ThingSpeakFeed = {
  field1: string | null;
  field2: string | null;
  created_at: string;
};

const POLLING_INTERVAL = 15000;

const Dashboard = () => {
  const { t } = useTranslation();

  const [node1, setNode1] = useState<number[]>([]);
  const [node2, setNode2] = useState<number[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const parseValues = (value?: string | null) => {
    if (!value) return [];
    return value.split(",").map((v) => parseFloat(v.trim()));
  };

  const formatTime = (utcString: string) => {
    const date = new Date(utcString);
    return date.toLocaleString();
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://api.thingspeak.com/channels/3232296/feeds.json?results=1"
      );

      const json = await res.json();

      if (json.feeds?.length > 0) {
        const latest: ThingSpeakFeed = json.feeds[0];

        setNode1(parseValues(latest.field1));
        setNode2(parseValues(latest.field2));
        setLastUpdated(formatTime(latest.created_at));
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-100">

      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-b-2xl sm:rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1492496913980-501348b61469"
          alt="Farm Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-3 sm:px-4 md:px-6">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
            🌱 {t("smartFarm")}
          </h1>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base lg:text-lg opacity-90">
            {t("liveSystem")}
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 -mt-12 sm:-mt-14 md:-mt-16 pb-8 md:pb-16 relative z-10">

        {/* NODE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <SensorCard title={t("node1")} values={node1} />
          <SensorCard title={t("node2")} values={node2} />
        </div>

        {/* NODE 3 CONTROL PANEL */}
        <div className="mt-8 sm:mt-10 md:mt-12 bg-white rounded-2xl sm:rounded-3xl shadow-lg md:shadow-xl p-4 sm:p-6 md:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-gray-800">
            ⚙ {t("motorPanel")}
          </h2>
          <Node3Control />
        </div>

        {/* NPK DASHBOARD */}
        <NPKDashboard />

        {/* LAST UPDATED */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <div className="inline-block bg-white shadow-md px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm text-gray-700">
            🕒 {t("lastUpdated")}{" "}
            <span className="font-semibold text-emerald-600">
              {lastUpdated || t("waiting")}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ================= SENSOR CARD ================= */

const SensorCard = ({
  title,
  values,
}: {
  title: string;
  values: number[];
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg md:shadow-xl p-4 sm:p-6 md:p-8 hover:shadow-xl sm:hover:shadow-2xl transition">
      <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800 text-center">
        📡 {title}
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <SensorItem
          icon={<Thermometer className="text-red-500 h-4 w-4 sm:h-5 sm:w-5" />}
          label={t("temperature")}
          value={values[0]}
          unit="°C"
        />

        <SensorItem
          icon={<Activity className="text-purple-500 h-4 w-4 sm:h-5 sm:w-5" />}
          label={t("ph")}
          value={values[1]}
        />

        <SensorItem
          icon={<Droplet className="text-blue-500 h-4 w-4 sm:h-5 sm:w-5" />}
          label={t("water")}
          value={values[2]}
        />

        <SensorItem
          icon={<Sun className="text-yellow-500 h-4 w-4 sm:h-5 sm:w-5" />}
          label={t("ldr")}
          value={values[3]}
        />
      </div>
    </div>
  );
};

/* ================= SENSOR ITEM ================= */

const SensorItem = ({
  icon,
  label,
  value,
  unit = "",
}: {
  icon: React.ReactNode;
  label: string;
  value?: number;
  unit?: string;
}) => (
  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-gray-50 hover:bg-gray-100 transition p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl">
    <div className="bg-white p-1 sm:p-1.5 md:p-2 rounded-lg sm:rounded-xl shadow">{icon}</div>
    <div className="flex-1">
      <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800">
        {value !== undefined ? `${value} ${unit}` : "--"}
      </p>
    </div>
  </div>
);

export default Dashboard;
