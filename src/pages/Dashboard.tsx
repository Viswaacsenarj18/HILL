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
    <div className="min-h-screen bg-gray-100">

      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-b-3xl">
        <img
          src="https://images.unsplash.com/photo-1492496913980-501348b61469"
          alt="Farm Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            🌱 {t("smartFarm")}
          </h1>
          <p className="mt-3 text-sm md:text-lg opacity-90">
            {t("liveSystem")}
          </p>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 pb-16 relative z-10">

        {/* NODE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SensorCard title={t("node1")} values={node1} />
          <SensorCard title={t("node2")} values={node2} />
        </div>

        {/* NODE 3 CONTROL PANEL */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            ⚙ {t("motorPanel")}
          </h2>
          <Node3Control />
        </div>

        {/* NPK DASHBOARD */}
        <NPKDashboard />

        {/* LAST UPDATED */}
        <div className="mt-10 text-center">
          <div className="inline-block bg-white shadow-md px-6 py-3 rounded-full text-sm text-gray-700">
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
    <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition">
      <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
        📡 {title}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <SensorItem
          icon={<Thermometer className="text-red-500" />}
          label={t("temperature")}
          value={values[0]}
          unit="°C"
        />

        <SensorItem
          icon={<Activity className="text-purple-500" />}
          label={t("ph")}
          value={values[1]}
        />

        <SensorItem
          icon={<Droplet className="text-blue-500" />}
          label={t("water")}
          value={values[2]}
        />

        <SensorItem
          icon={<Sun className="text-yellow-500" />}
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
  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
    <div className="bg-white p-2 rounded-xl shadow">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800">
        {value !== undefined ? `${value} ${unit}` : "--"}
      </p>
    </div>
  </div>
);

export default Dashboard;
