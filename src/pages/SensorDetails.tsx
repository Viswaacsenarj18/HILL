import { useEffect, useState } from "react";
import {
  Thermometer,
  Activity,
  Droplet,
  Sun,
  Leaf,
  FlaskConical,
  Shield,
  RefreshCw,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ================= CHANNEL IDS ================= */

const NODE1_ID = "3232296";
const NODE2_ID = "3233683";
const NPK_ID = "3261075";

export default function SensorDetails() {
  const [node1, setNode1] = useState<any[]>([]);
  const [node2, setNode2] = useState<any[]>([]);
  const [npk, setNpk] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("node1-ldr");
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

  /* ================= FIELD MAP ================= */

  const fieldMap: any = {
    "node1-temp": { label: "Node 1 - Temperature", key: "field1", data: node1, color: "#ef4444", icon: <Thermometer size={16}/> },
    "node1-ph": { label: "Node 1 - pH Level", key: "field2", data: node1, color: "#8b5cf6", icon: <Activity size={16}/> },
    "node1-water": { label: "Node 1 - Water Level", key: "field3", data: node1, color: "#3b82f6", icon: <Droplet size={16}/> },
    "node1-ldr": { label: "Node 1 - LDR (Light)", key: "field4", data: node1, color: "#facc15", icon: <Sun size={16}/> },

    "node2-temp": { label: "Node 2 - Temperature", key: "field1", data: node2, color: "#dc2626", icon: <Thermometer size={16}/> },
    "node2-ph": { label: "Node 2 - pH Level", key: "field2", data: node2, color: "#7c3aed", icon: <Activity size={16}/> },
    "node2-water": { label: "Node 2 - Water Level", key: "field3", data: node2, color: "#2563eb", icon: <Droplet size={16}/> },
    "node2-ldr": { label: "Node 2 - LDR (Light)", key: "field4", data: node2, color: "#eab308", icon: <Sun size={16}/> },

    "npk-n": { label: "Nitrogen (N)", key: "field1", data: npk, color: "#16a34a", icon: <Leaf size={16}/> },
    "npk-p": { label: "Phosphorus (P)", key: "field2", data: npk, color: "#2563eb", icon: <FlaskConical size={16}/> },
    "npk-k": { label: "Potassium (K)", key: "field3", data: npk, color: "#f97316", icon: <Shield size={16}/> },
  };

  const current = fieldMap[selected];

  /* ================= FIX SPIKE CUTTING ================= */

  const formattedData = current.data.map((item: any) => ({
    ...item,
    value: Number(item[current.key]),
  }));

  const maxValue = Math.max(...formattedData.map((d: any) => d.value), 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

          <SidebarSection title="📡 Node 1">
            <SidebarItem label="Temperature" icon={<Thermometer size={14}/>} active={selected==="node1-temp"} onClick={()=>setSelected("node1-temp")}/>
            <SidebarItem label="pH Level" icon={<Activity size={14}/>} active={selected==="node1-ph"} onClick={()=>setSelected("node1-ph")}/>
            <SidebarItem label="Water Level" icon={<Droplet size={14}/>} active={selected==="node1-water"} onClick={()=>setSelected("node1-water")}/>
            <SidebarItem label="LDR (Light)" icon={<Sun size={14}/>} active={selected==="node1-ldr"} onClick={()=>setSelected("node1-ldr")}/>
          </SidebarSection>

          <SidebarSection title="📡 Node 2">
            <SidebarItem label="Temperature" icon={<Thermometer size={14}/>} active={selected==="node2-temp"} onClick={()=>setSelected("node2-temp")}/>
            <SidebarItem label="pH Level" icon={<Activity size={14}/>} active={selected==="node2-ph"} onClick={()=>setSelected("node2-ph")}/>
            <SidebarItem label="Water Level" icon={<Droplet size={14}/>} active={selected==="node2-water"} onClick={()=>setSelected("node2-water")}/>
            <SidebarItem label="LDR (Light)" icon={<Sun size={14}/>} active={selected==="node2-ldr"} onClick={()=>setSelected("node2-ldr")}/>
          </SidebarSection>

          <SidebarSection title="🌿 NPK">
            <SidebarItem label="Nitrogen" icon={<Leaf size={14}/>} active={selected==="npk-n"} onClick={()=>setSelected("npk-n")}/>
            <SidebarItem label="Phosphorus" icon={<FlaskConical size={14}/>} active={selected==="npk-p"} onClick={()=>setSelected("npk-p")}/>
            <SidebarItem label="Potassium" icon={<Shield size={14}/>} active={selected==="npk-k"} onClick={()=>setSelected("npk-k")}/>
          </SidebarSection>

        </div>

        {/* MAIN */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl p-6 md:p-10">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-700">
              {current.label}
            </h2>

            <button
              onClick={fetchData}
              className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""}/>
              Refresh
            </button>
          </div>

          {/* GRAPH CARD */}
          <div className="w-full h-[400px] md:h-[520px] bg-slate-50 rounded-2xl p-6">

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{ top: 40, right: 50, left: 40, bottom: 30 }}
              >
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />

                <XAxis
                  dataKey="entry_id"
                  tick={{ fontSize: 12 }}
                  padding={{ left: 20, right: 20 }}
                />

                <YAxis
                  domain={[0, maxValue + 30]}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.1)"
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={current.color}
                  strokeWidth={4}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

        </div>
      </div>
    </div>
  );
}

/* SIDEBAR */

const SidebarSection = ({title, children}:any)=>(
  <div>
    <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const SidebarItem = ({label, icon, active, onClick}:any)=>(
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${
      active
        ? "bg-emerald-600 text-white shadow-md"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    }`}
  >
    {icon}
    {label}
  </button>
);
