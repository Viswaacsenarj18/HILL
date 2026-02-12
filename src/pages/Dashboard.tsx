import { useEffect, useState } from "react";
import { Thermometer, Droplet, Sun, Activity } from "lucide-react";
import Loading from "./Loading";
import Node3Control from "./Node3Control";
import NPKDashboard from "./NPKDashboard";

type ThingSpeakFeed = {
  field1: string | null;
  field2: string | null;
  field3: string | null;
  field4: string | null;
  created_at: string;
};

const Dashboard = () => {
  const [node1, setNode1] = useState<ThingSpeakFeed | null>(null);
  const [node2, setNode2] = useState<ThingSpeakFeed | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      if (!node1 && !node2) setLoading(true);
      else setUpdating(true);

      const [res1, res2] = await Promise.all([
        fetch(
          "https://api.thingspeak.com/channels/3232296/feeds.json?api_key=1DF7VGBJUG072J8I&results=1"
        ),
        fetch(
          "https://api.thingspeak.com/channels/3233683/feeds.json?results=1"
        ),
      ]);

      const json1 = await res1.json();
      const json2 = await res2.json();

      if (json1.feeds?.length > 0) {
        setNode1(json1.feeds[0]);
      }

      if (json2.feeds?.length > 0) {
        setNode2(json2.feeds[0]);
        setLastUpdated(
          new Date(json2.feeds[0].created_at).toLocaleTimeString()
        );
      }
    } catch (error) {
      console.error("ThingSpeak Fetch Error:", error);
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  if (loading && !node1 && !node2) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-6xl">

        <h1 className="text-3xl font-bold mb-8 text-center text-emerald-700">
          🌱 Farm Monitoring Dashboard
        </h1>

        {updating && (
          <p className="text-center text-xs text-green-600 animate-pulse mb-4">
            🔄 Updating live data...
          </p>
        )}

        {/* NODE 1 & NODE 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <SensorCard title="📡 Node 1" color="green" data={node1} />
          <SensorCard title="📡 Node 2" color="blue" data={node2} />

        </div>

        {/* NODE 3 CONTROL */}
        <div className="mt-10 max-w-lg mx-auto">
          <Node3Control />
        </div>

        {/* NPK DASHBOARD */}
        <div className="mt-12">
          <NPKDashboard />
        </div>

        <p className="text-center text-xs text-gray-500 mt-10">
          Last Updated: {lastUpdated || "Waiting for data..."}
        </p>

      </div>
    </div>
  );
};

const SensorCard = ({
  title,
  color,
  data,
}: {
  title: string;
  color: "green" | "blue";
  data: ThingSpeakFeed | null;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-md border">
    <h2
      className={`text-lg font-semibold mb-6 text-${color}-600 text-center`}
    >
      {title}
    </h2>

    <div className="space-y-5">
      <SensorRow icon={<Thermometer className="text-red-500 w-5 h-5" />} label="Temperature" value={data?.field1} unit="°C" />
      <SensorRow icon={<Activity className="text-purple-500 w-5 h-5" />} label="pH Level" value={data?.field2} />
      <SensorRow icon={<Droplet className="text-blue-500 w-5 h-5" />} label="Water Level" value={data?.field3} />
      <SensorRow icon={<Sun className="text-yellow-500 w-5 h-5" />} label="LDR (Light)" value={data?.field4} />
    </div>
  </div>
);

const SensorRow = ({
  icon,
  label,
  value,
  unit = "",
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
  unit?: string;
}) => (
  <div className="flex items-center gap-4">
    {icon}
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">
        {value ?? "--"} {unit}
      </p>
    </div>
  </div>
);

export default Dashboard;
