

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Players() {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

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

        const res = await fetch("http://localhost:8081/playerbytag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tag: selectedValue }),
        });

        const mydata = await res.json();
        console.log("Response:", mydata);

        if (mydata.success && mydata.playerInfo) {
          setPlayer(mydata.playerInfo);
        } else {
          setError(mydata.error || "Failed to load player.");
        }

        setLoading(false);
      } catch (err) {
        console.log("Error fetching player:", err);
        setError("Failed to load player.");
        setLoading(false);
      }
    };

    if (selectedValue) {
      getPlayer();
    }
  }, [selectedValue]);

 

return (
  <div className="h-[500px] bg-gradient-to-r from-[#384f84] via-[#1e293b] to-[#15203a] p-6 rounded-2xl shadow-2xl text-white flex flex-col">
    {/* Form */}
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 items-center bg-gray-900/60 p-3 rounded-xl shadow-md mb-6"
    >
      <div className="relative w-full">
        <input
          type="text"
          className="w-full bg-gray-800/70 text-white rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none placeholder-gray-400"
          placeholder="🔍 Enter Player Tag (e.g. #YRUYL22)"
          value={inputValue}
          onChange={handleChange}
        />
        <span className="absolute left-3 top-2.5 text-gray-400">#</span>
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg shadow hover:bg-yellow-500 transition"
      >
        Search
      </button>
    </form>

    {/* Loading */}
    {loading && (
      <div className="flex justify-center items-center flex-1">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )}

    {/* Error */}
    {error && !loading && (
      <div className="text-red-400 text-center flex-1 flex items-center justify-center">
        {error}
      </div>
    )}

    {/* Data */}
    {player && !loading && (
      <div className="bg-gray-900/80 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg transition hover:scale-105">
        {/* Clan Badge */}
        <Link to={`/player/${player.tag.replace("#", "")}`}>
          <img
            src={player.clan?.badge?.url}
            alt={player.name}
            className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-md"
          />
        </Link>

        {/* Player Info */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <p className="text-xl font-bold">{player.name}</p>
          <p>
            <span className="font-semibold text-yellow-400">🏷️ Tag:</span>{" "}
            {player.tag}
          </p>
          <p>
            <span className="font-semibold text-yellow-400">🏆 Trophies:</span>{" "}
            {player.trophies}
          </p>
          <p>
            <span className="font-semibold text-yellow-400">⭐ Level:</span>{" "}
            {player.expLevel}
          </p>
        </div>
      </div>
    )}
  </div>
);





}
