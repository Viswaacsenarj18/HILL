import { useEffect, useState } from "react";
import { Power, Droplet, Timer } from "lucide-react";
import { useTranslation } from "react-i18next";

const WRITE_API =
  "https://api.thingspeak.com/update?api_key=28VB3EVNSX0N4IE2";

const READ_API =
  "https://api.thingspeak.com/channels/3259969/feeds.json?api_key=XP2ZYZMV4QHKX03O&results=1";

const LOCK_TIME = 15; // seconds

const Node3Control = () => {
  const { t } = useTranslation();
  const [motorStatus, setMotorStatus] = useState(false);
  const [fertilizerStatus, setFertilizerStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  /* ================= FETCH STATUS ================= */
  const fetchStatus = async () => {
    try {
      const res = await fetch(READ_API);
      const json = await res.json();

      if (json.feeds?.length > 0) {
        const data = json.feeds[0];
        setMotorStatus(data.field3 === "1");
        setFertilizerStatus(data.field2 === "1");
      }
    } catch (err) {
      console.error("Read Error:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  /* ================= TIMER ================= */
  useEffect(() => {
    let interval: any;

    if (lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000);
    } else if (lockTimer === 0 && isLocked) {
      setIsLocked(false);
    }

    return () => clearInterval(interval);
  }, [lockTimer]);

  /* ================= UPDATE ================= */
  const updateBoth = async (newMotor: number, newFertilizer: number) => {
    if (isLocked) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${WRITE_API}&field3=${newMotor}&field2=${newFertilizer}`
      );

      const result = await response.text();

      if (result !== "0") {
        await fetchStatus();

        // 🔥 Start 15 sec lock for ANY button click
        setIsLocked(true);
        setLockTimer(LOCK_TIME);
      } else {
        alert(t("updateRejected"));
      }
    } catch (err) {
      console.error("Write Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl md:shadow-2xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto border">

      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6 md:mb-8">
        ⚙ {t("motorAndFertilizerControl")}
      </h2>

      {/* TIMER DISPLAY */}
      {isLocked && (
        <div className="flex justify-center items-center gap-2 mb-4 sm:mb-6 md:mb-8 bg-amber-100 text-amber-700 px-3 sm:px-4 py-2 sm:py-3 rounded-full text-xs sm:text-sm md:text-base">
          <Timer size={16} className="sm:w-5 sm:h-5" />
          <span className="font-semibold">
            {t("pleaseWait")} {lockTimer}s...
          </span>
        </div>
      )}

      {/* ================= MOTOR ================= */}
      <div className="mb-6 sm:mb-8 md:mb-10">

        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Power className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            <span className="font-semibold text-base sm:text-lg md:text-xl text-gray-700">
              Motor Pump
            </span>
          </div>

          <span
            className={`font-bold text-sm sm:text-base md:text-lg ${
              motorStatus ? "text-green-600" : "text-red-500"
            }`}
          >
            {motorStatus ? "ON" : "OFF"}
          </span>
        </div>

        <div className="flex gap-2 sm:gap-3 md:gap-4">

          <button
            disabled={loading || isLocked}
            onClick={() =>
              updateBoth(1, fertilizerStatus ? 1 : 0)
            }
            className={`flex-1 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition ${
              motorStatus
                ? "bg-green-600 text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-800"
            } ${isLocked ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            ON
          </button>

          <button
            disabled={loading || isLocked}
            onClick={() =>
              updateBoth(0, fertilizerStatus ? 1 : 0)
            }
            className={`flex-1 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition ${
              !motorStatus
                ? "bg-red-600 text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-800"
            } ${isLocked ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            OFF
          </button>

        </div>
      </div>

      {/* ================= FERTILIZER ================= */}
      <div>

        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Droplet className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span className="font-semibold text-base sm:text-lg md:text-xl text-gray-700">
              Fertilizer
            </span>
          </div>

          <span
            className={`font-bold text-sm sm:text-base md:text-lg ${
              fertilizerStatus ? "text-green-600" : "text-red-500"
            }`}
          >
            {fertilizerStatus ? "ON" : "OFF"}
          </span>
        </div>

        <div className="flex gap-2 sm:gap-3 md:gap-4">

          <button
            disabled={loading || isLocked}
            onClick={() =>
              updateBoth(motorStatus ? 1 : 0, 1)
            }
            className={`flex-1 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition ${
              fertilizerStatus
                ? "bg-green-600 text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-800"
            } ${isLocked ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            ON
          </button>

          <button
            disabled={loading || isLocked}
            onClick={() =>
              updateBoth(motorStatus ? 1 : 0, 0)
            }
            className={`flex-1 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg transition ${
              !fertilizerStatus
                ? "bg-red-600 text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-800"
            } ${isLocked ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            OFF
          </button>

        </div>
      </div>

    </div>
  );
};

export default Node3Control;
