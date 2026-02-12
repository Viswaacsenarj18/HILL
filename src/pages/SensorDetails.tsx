import { useEffect, useState } from "react";
import {
  Thermometer,
  Activity,
  Droplet,
  Sun,
  Leaf,
  RefreshCw,
  Download,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

/* ================= CHANNEL IDS ================= */

const NODE1_ID = "3232296";
const NODE2_ID = "3233683";
const NPK_ID = "3261075";

/* ================= COMPONENT ================= */

const SensorDetails = () => {
  const [node1, setNode1] = useState<any[]>([]);
  const [node2, setNode2] = useState<any[]>([]);
  const [npk, setNpk] = useState<any[]>([]);
  const [selected, setSelected] = useState<"node1" | "node2" | "npk">("node1");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [n1, n2, n4] = await Promise.all([
        fetch(`https://api.thingspeak.com/channels/${NODE1_ID}/feeds.json?results=20`),
        fetch(`https://api.thingspeak.com/channels/${NODE2_ID}/feeds.json?results=20`),
        fetch(`https://api.thingspeak.com/channels/${NPK_ID}/feeds.json?results=20`),
      ]);

      const j1 = await n1.json();
      const j2 = await n2.json();
      const j4 = await n4.json();

      setNode1(j1.feeds || []);
      setNode2(j2.feeds || []);
      setNpk(j4.feeds || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD ================= */

  const downloadData = (channelId: string, type: "json" | "csv" | "xml") => {
    window.open(
      `https://api.thingspeak.com/channels/${channelId}/feeds.${type}`,
      "_blank"
    );
  };

  /* ================= CONFIG ================= */

  const channelConfig = {
    node1: {
      title: "Node 1",
      data: node1,
      id: NODE1_ID,
      lines: [
        { key: "field1", name: "Temperature", color: "#ef4444" },
        { key: "field2", name: "pH", color: "#8b5cf6" },
        { key: "field3", name: "Water Level", color: "#3b82f6" },
        { key: "field4", name: "LDR (Light)", color: "#facc15" },
      ],
    },
    node2: {
      title: "Node 2",
      data: node2,
      id: NODE2_ID,
      lines: [
        { key: "field1", name: "Temperature", color: "#dc2626" },
        { key: "field2", name: "pH", color: "#7c3aed" },
        { key: "field3", name: "Water Level", color: "#2563eb" },
        { key: "field4", name: "LDR (Light)", color: "#eab308" },
      ],
    },
    npk: {
      title: "NPK Channel",
      data: npk,
      id: NPK_ID,
      lines: [
        { key: "field1", name: "Nitrogen", color: "#16a34a" },
        { key: "field2", name: "Phosphorus", color: "#2563eb" },
        { key: "field3", name: "Potassium", color: "#f97316" },
      ],
    },
  };

  const current = channelConfig[selected];

  /* ================= STATUS LOGIC ================= */

  const getStatus = (value: number) => {
    if (value < 30) return { label: "Low", color: "bg-red-100 text-red-600" };
    if (value <= 70) return { label: "Normal", color: "bg-green-100 text-green-600" };
    return { label: "High", color: "bg-yellow-100 text-yellow-700" };
  };

  const latest = current.data[current.data.length - 1] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ================= SIDEBAR ================= */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">

          <SidebarButton
            active={selected === "node1"}
            label="📡 Node 1"
            onClick={() => setSelected("node1")}
          />
          <SidebarButton
            active={selected === "node2"}
            label="📡 Node 2"
            onClick={() => setSelected("node2")}
          />
          <SidebarButton
            active={selected === "npk"}
            label="🌿 NPK"
            onClick={() => setSelected("npk")}
          />

        </div>

        {/* ================= GRAPH AREA ================= */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-2xl p-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

            <h2 className="text-2xl font-bold text-gray-700">
              {current.title} - All Readings
            </h2>

            <div className="flex gap-3 flex-wrap">
              <DownloadButton onClick={() => downloadData(current.id, "json")} label="JSON" />
              <DownloadButton onClick={() => downloadData(current.id, "csv")} label="CSV" />
              <DownloadButton onClick={() => downloadData(current.id, "xml")} label="XML" />
              <button
                onClick={fetchData}
                className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
                Refresh
              </button>
            </div>
          </div>

          {/* GRAPH FIXED ALIGNMENT */}
          <div className="w-full h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={current.data}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                <XAxis dataKey="entry_id" />
                <YAxis />
                <Tooltip />
                <Legend />

                {current.lines.map((line: any, i: number) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={line.key}
                    stroke={line.color}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name={line.name}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* STATUS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {current.lines.map((line: any, index: number) => {
              const value = Number(latest[line.key] || 0);
              const status = getStatus(value);

              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-slate-50 border shadow-sm"
                >
                  <h3 className="font-semibold text-gray-600">
                    {line.name}
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-gray-800">
                    {value}
                  </p>
                  <span
                    className={`inline-block mt-3 px-3 py-1 text-sm rounded-full ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const SidebarButton = ({ active, label, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-3 rounded-xl text-left font-semibold transition ${
      active
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    }`}
  >
    {label}
  </button>
);

const DownloadButton = ({ onClick, label }: any) => (
  <button
    onClick={onClick}
    className="bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition"
  >
    {label}
  </button>
);

export default SensorDetails;
