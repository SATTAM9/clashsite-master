

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Clan() {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [clan, setClan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const trimmedTag = inputValue.trim();
    if (!trimmedTag) {
      setError("please enter a valid tag");
      return;
    }

    setSelectedValue(trimmedTag);
  };

  useEffect(() => {
    const getClan = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          ` ${import.meta.env.VITE_API_URL}/clanbytag/${encodeURIComponent(
            selectedValue
          )}`
        );
        const data = await response.json();

        if (data.success && data.clanInfo) {
          setClan(data.clanInfo);
        } else {
          setClan(null);
          setError("clan not found");
        }
      } catch (err) {
        console.error("Error fetching clan:", err);
        setClan(null);
        setError("error when fetching clan");
      } finally {
        setLoading(false);
      }
    };

    if (selectedValue) {
      getClan();
    }
  }, [selectedValue]);

  return (
    <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white max-w-3xl mx-auto">
      {/* العنوان */}
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
        search for clan
      </h2>

      {/* الفورم */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 items-center bg-slate-800/60 p-3 rounded-2xl shadow-inner mb-6"
      >
        <div className="relative w-full">
          <input
            type="text"
            className="w-full bg-slate-900/70 text-white rounded-xl pl-10 pr-3 py-3 focus:ring-2 focus:ring-yellow-400 focus:outline-none placeholder-gray-400 text-lg"
            placeholder="enter the tag"
            value={inputValue}
            onChange={handleChange}
          />
          <span className="absolute left-3 top-3 text-gray-400 text-lg">#</span>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow hover:bg-yellow-500 transition text-lg"
        >
          search
        </button>
      </form>

      {/* اللودينج */}
      {loading && (
        <div className="flex justify-center items-center flex-1">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="sr-only">loading...</span>
        </div>
      )}

      {/* الخطأ */}
      {error && !loading && (
        <div className="text-red-400 text-center flex-1 flex items-center justify-center font-semibold">
          {error}
        </div>
      )}

      {/* النتيجة */}
      {clan && !loading && (
        <div className="bg-slate-800/80 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg transition hover:scale-[1.02]">
          <Link to={`/clan/${clan.tag.replace("#", "")}`}>
            <img
              src={clan.badge?.url}
              alt={clan.name}
              className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-md hover:scale-105 transition"
            />
          </Link>
          <div className="space-y-2 text-center md:text-left">
            <p className="text-2xl font-bold">{clan.name}</p>
            <p className="text-lg">
              <span className="font-semibold text-yellow-400">tag:</span>{" "}
              {clan.tag}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-yellow-400">level:</span>{" "}
              {clan.level}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
