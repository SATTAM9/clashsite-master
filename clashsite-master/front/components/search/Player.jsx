

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Players() {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setInputValue(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!inputValue.trim()) {
      setError("Please enter a player tag.");
      return;
    }
    setSelectedValue(inputValue.trim());
  };

  useEffect(() => {
    const getPlayer = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/playerbytag`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag: selectedValue }),
        });
        const mydata = await res.json();
        if (mydata.success && mydata.playerInfo) {
          setPlayer(mydata.playerInfo);
        } else {
          setError(mydata.error || "Failed to load player.");
        }
      } catch (err) {
        setError("Failed to load player.");
      } finally {
        setLoading(false);
      }
    };
    if (selectedValue) getPlayer();
  }, [selectedValue]);

  return (
    <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white max-w-3xl mx-auto">
      {/* العنوان */}
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
        Search for Player
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
            placeholder="Enter player tag (e.g. #YRUYL22)"
            value={inputValue}
            onChange={handleChange}
          />
          <span className="absolute left-3 top-3 text-gray-400 text-lg">#</span>
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow hover:bg-yellow-500 transition text-lg"
        >
          Search
        </button>
      </form>

      {/* اللودينج */}
      {loading && (
        <div className="flex justify-center items-center flex-1">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* الخطأ */}
      {error && !loading && (
        <div className="text-red-400 text-center flex-1 flex items-center justify-center font-semibold">
          {error}
        </div>
      )}

      {/* النتيجة */}
      {player && !loading && (
        <div className="bg-slate-800/80 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg transition hover:scale-[1.02]">
          <Link to={`/player/${player.tag.replace("#", "")}`}>
            <img
              src={player.league?.icon?.url}
              alt={player.name}
              className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-md hover:scale-105 transition"
            />
          </Link>
          <div className="space-y-2 text-center md:text-left flex-1">
            <p className="text-2xl font-bold">{player.name}</p>
            <p className="text-lg">
              <span className="font-semibold text-yellow-400">Tag:</span>{" "}
              {player.tag}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-yellow-400">Trophies:</span>{" "}
              {player.trophies}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-yellow-400">Level:</span>{" "}
              {player.expLevel}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
