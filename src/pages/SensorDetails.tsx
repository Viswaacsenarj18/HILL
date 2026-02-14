import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ================= CONFIG ================= */

const CHANNEL_ID = "3232296";

/* ================= TYPES ================= */

type Feed = {
  entry_id: number;
  field1?: string; // Node1 CSV
  field2?: string; // Node2 CSV
  field3?: string; // NPK CSV
};

/* ================= COMPONENT ================= */

export default function SensorDetails() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [selected, setSelected] = useState<string>("node1-ldr");

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= FETCH ================= */

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?results=40`
      );
      const json = await res.json();
      setFeeds(json.feeds || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  /* ================= PARSE ================= */

  const parseNode = (value?: string) => {
    if (!value) return [0, 0, 0, 0];
    const parts = value.split(",").map((v) => Number(v.trim()));
    return [
      parts[0] || 0,
      parts[1] || 0,
      parts[2] || 0,
      parts[3] || 0,
    ];
  };

  const parseNPK = (value?: string) => {
    if (!value) return [0, 0, 0];
    const parts = value.split(",").map((v) => Number(v.trim()));
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  };

  /* ================= FIELD MAP ================= */

  const fieldMap: any = {
    // NODE 1
    "node1-temp": { label: "Temperature", index: 0, source: "field1", color: "#ef4444" },
    "node1-ph": { label: "pH Level", index: 1, source: "field1", color: "#8b5cf6" },
    "node1-water": { label: "Water Level", index: 2, source: "field1", color: "#3b82f6" },
    "node1-ldr": { label: "LDR (Light)", index: 3, source: "field1", color: "#10b981" },
    "node1-all": { label: "All Values", source: "field1" },

    // NODE 2
    "node2-temp": { label: "Temperature", index: 0, source: "field2", color: "#dc2626" },
    "node2-ph": { label: "pH Level", index: 1, source: "field2", color: "#7c3aed" },
    "node2-water": { label: "Water Level", index: 2, source: "field2", color: "#2563eb" },
    "node2-ldr": { label: "LDR (Light)", index: 3, source: "field2", color: "#f59e0b" },
    "node2-all": { label: "All Values", source: "field2" },

    // NPK
    "npk-n": { label: "Nitrogen", index: 0, source: "field3", color: "#16a34a" },
    "npk-p": { label: "Phosphorus", index: 1, source: "field3", color: "#2563eb" },
    "npk-k": { label: "Potassium", index: 2, source: "field3", color: "#f97316" },
    "npk-all": { label: "All Values", source: "field3" },
  };

  const current = fieldMap[selected];

  /* ================= FORMAT GRAPH ================= */

  let formattedData: any[] = [];

  if (selected.includes("all")) {
    formattedData = feeds.map((item) => {
      const values =
        current.source === "field3"
          ? parseNPK(item.field3)
          : parseNode(item[current.source]);

      return {
        entry_id: item.entry_id,
        v1: values[0] || 0,
        v2: values[1] || 0,
        v3: values[2] || 0,
        v4: values[3] || 0,
      };
    });
  } else {
    formattedData = feeds.map((item) => {
      const values =
        current.source === "field3"
          ? parseNPK(item.field3)
          : parseNode(item[current.source]);

      return {
        entry_id: item.entry_id,
        value: values[current.index] || 0,
      };
    });
  }

  /* ================= DOWNLOAD ================= */

  const downloadFile = (type: "json" | "csv" | "xml") => {
    window.open(
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.${type}?results=100`,
      "_blank"
    );
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO SECTION */}
      <div className="relative h-[320px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854"
          className="w-full h-full object-cover"
          alt="Farm"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">
            🌱 Sensor Analytics
          </h1>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 pb-16 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">

            <Sidebar title="🌡 Node 1">
              {["temp","ph","water","ldr","all"].map((type) => {
                const key = `node1-${type}`;
                return (
                  <SidebarItem
                    key={key}
                    label={fieldMap[key].label}
                    active={selected === key}
                    onClick={() => setSelected(key)}
                  />
                );
              })}
            </Sidebar>

            <Sidebar title="🛰 Node 2">
              {["temp","ph","water","ldr","all"].map((type) => {
                const key = `node2-${type}`;
                return (
                  <SidebarItem
                    key={key}
                    label={fieldMap[key].label}
                    active={selected === key}
                    onClick={() => setSelected(key)}
                  />
                );
              })}
            </Sidebar>

            <Sidebar title="🌿 NPK">
              {["n","p","k","all"].map((type) => {
                const key = `npk-${type}`;
                return (
                  <SidebarItem
                    key={key}
                    label={fieldMap[key].label}
                    active={selected === key}
                    onClick={() => setSelected(key)}
                  />
                );
              })}
            </Sidebar>

          </div>

          {/* GRAPH CARD */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-8">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                {current.label}
              </h2>

              <div className="flex gap-3">
                <DownloadBtn label="JSON" onClick={() => downloadFile("json")} />
                <DownloadBtn label="CSV" onClick={() => downloadFile("csv")} />
                <DownloadBtn label="XML" onClick={() => downloadFile("xml")} />
              </div>
            </div>

            <div className="w-full h-[400px] bg-gray-50 rounded-2xl p-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="entry_id" />
                  <YAxis />
                  <Tooltip />

                  {selected.includes("all") ? (
                    <>
                      <Line type="monotone" dataKey="v1" stroke="#ef4444" />
                      <Line type="monotone" dataKey="v2" stroke="#8b5cf6" />
                      <Line type="monotone" dataKey="v3" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="v4" stroke="#10b981" />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={current.color}
                      strokeWidth={3}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Sidebar = ({ title, children }: any) => (
  <div>
    <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const SidebarItem = ({ label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2 rounded-xl transition text-left ${
      active
        ? "bg-emerald-600 text-white"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    }`}
  >
    {label}
  </button>
);

const DownloadBtn = ({ label, onClick }: any) => (
  <button
    onClick={onClick}
    className="bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 transition"
  >
    {label}
  </button>
);
