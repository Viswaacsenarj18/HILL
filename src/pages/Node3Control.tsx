import { useEffect, useState } from "react";
import { Power, Droplet } from "lucide-react";

const WRITE_API =
  "https://api.thingspeak.com/update?api_key=28VB3EVNSX0N4IE2";

const READ_API =
  "https://api.thingspeak.com/channels/3259969/feeds.json?api_key=XP2ZYZMV4QHKX03O&results=1";

const Node3Control = () => {
  const [motorStatus, setMotorStatus] = useState(false);
  const [fertilizerStatus, setFertilizerStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= READ FROM SERVER ================= */
  const fetchStatus = async () => {
    try {
      const res = await fetch(READ_API);
      const json = await res.json();

      if (json.feeds && json.feeds.length > 0) {
        const data = json.feeds[0];

        // 🔥 Motor moved to FIELD 3
        setMotorStatus(data.field3 === "1");

        // Fertilizer remains FIELD 2
        setFertilizerStatus(data.field2 === "1");
      }
    } catch (err) {
      console.error("Read Error:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  /* ================= WRITE BOTH FIELDS ================= */
  const updateBoth = async (newMotor: number, newFertilizer: number) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${WRITE_API}&field3=${newMotor}&field2=${newFertilizer}`
      );

      const result = await response.text();

      // ThingSpeak returns entry ID if success
      if (result !== "0") {
        await fetchStatus(); // Sync UI
      } else {
        alert("Update rejected. Wait 15 seconds.");
      }

    } catch (err) {
      console.error("Write Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border">
      <h2 className="text-xl font-bold mb-6 text-center text-indigo-600">
        📡 Control Panel
      </h2>

      {/* ================= MOTOR ================= */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          <div className="flex gap-2 items-center">
            <Power className="text-green-600" />
            <p className="font-semibold">Motor Pump</p>
          </div>
          <span className={motorStatus ? "text-green-600" : "text-red-500"}>
            {motorStatus ? "ON (1)" : "OFF (0)"}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            disabled={loading}
            onClick={() =>
              updateBoth(1, fertilizerStatus ? 1 : 0)
            }
            className="flex-1 bg-green-500 text-white py-2 rounded-lg"
          >
            ON
          </button>

          <button
            disabled={loading}
            onClick={() =>
              updateBoth(0, fertilizerStatus ? 1 : 0)
            }
            className="flex-1 bg-red-500 text-white py-2 rounded-lg"
          >
            OFF
          </button>
        </div>
      </div>

      {/* ================= FERTILIZER ================= */}
      <div>
        <div className="flex justify-between mb-3">
          <div className="flex gap-2 items-center">
            <Droplet className="text-blue-600" />
            <p className="font-semibold">Fertilizer</p>
          </div>
          <span className={fertilizerStatus ? "text-green-600" : "text-red-500"}>
            {fertilizerStatus ? "ON (1)" : "OFF (0)"}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            disabled={loading}
            onClick={() =>
              updateBoth(motorStatus ? 1 : 0, 1)
            }
            className="flex-1 bg-green-500 text-white py-2 rounded-lg"
          >
            ON
          </button>

          <button
            disabled={loading}
            onClick={() =>
              updateBoth(motorStatus ? 1 : 0, 0)
            }
            className="flex-1 bg-red-500 text-white py-2 rounded-lg"
          >
            OFF
          </button>
        </div>
      </div>

      {loading && (
        <p className="text-xs text-center mt-4 text-gray-500">
          Sending...
        </p>
      )}
    </div>
  );
};

export default Node3Control;
