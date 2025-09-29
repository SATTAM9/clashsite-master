import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LinkedPlayers from "./LinkedPlayers";

const OverView = () => {
  const [playerTag, setPlayerTag] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [player, setPlayer] = useState(null);
  const [status, setStatus] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  // serch player
  useEffect(() => {
    const getPlayer = async () => {
      try {
        setStatus("loading");
        const res = await fetch(" import.meta.env.VITE_API_URL/playerbytag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tag: selectedValue }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Server error", res.status, text);
          setStatus("error");
          setPlayer(null);
          return;
        }

        const text = await res.text();
        if (!text) {
          setStatus("notfound");
          setPlayer(null);
          return;
        }

        const data = JSON.parse(text);
        console.log("Response:", data);

        if (data.success && data.playerInfo) {
          setPlayer(data.playerInfo);
          setStatus("found");
        } else {
          setPlayer(null);
          setStatus("notfound");
        }
      } catch (err) {
        console.error("Error fetching player:", err);
        setStatus("error");
        setPlayer(null);
      }
    };

    if (selectedValue) {
      getPlayer();
    }
  }, [selectedValue]);

  const confirmToken = async () => {
    if (!player) return;

    try {
      setVerifyStatus("checking");
      const tag = player.tag.replace("#", "");
      console.log("Player tag:", tag);

      const response = await fetch(
        ` ${import.meta.env.VITE_API_URL}/players/${tag}/verifytoken`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: verifyToken }),
        }
      );

      const data = await response.json();
      console.log("verifytoken response:", data);

      if (data.status === "ok") {
        setVerifyStatus("valid");
        alert("✅ Token verified successfully!");

        const token = Cookies.get("accessToken");
        const decoded = jwtDecode(token);
        const email = decoded.userInfo.email;

        const response = await fetch(
          ` ${import.meta.env.VITE_API_URL}/addlinkedplayers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email, playerTag: player.tag }),
          }
        );

        const data = await response.json();
        console.log("data", data);
        setRefreshCount((prev) => prev + 1);
      } else {
        setVerifyStatus("invalid");
        alert(data.message || " Invalid token");
      }
    } catch (error) {
      console.error("verifytoken error:", error);
      setVerifyStatus("error");
    }
  };

  return (
    <div className="space-y-4 p-6 bg-black text-white rounded">
      <LinkedPlayers refresh={refreshCount} />

      <h2 className="text-xl font-bold">Search Player</h2>

      <input
        type="text"
        placeholder="#PLAYER_TAG"
        value={playerTag}
        onChange={(e) => setPlayerTag(e.target.value)}
        className="w-full rounded border border-white/20 bg-black/30 p-2"
      />

      <button
        onClick={() => setSelectedValue(playerTag)}
        className="bg-amber-500 px-4 py-2 rounded"
      >
        Search Player
      </button>

      {status === "loading" && <p>Loading...</p>}
      {status === "notfound" && (
        <p className="text-red-400">Player not found</p>
      )}
      {status === "error" && (
        <p className="text-red-400">Error loading player</p>
      )}

      {player && (
        <div className="mt-4 p-4 bg-white/10 rounded">
          <h3 className="text-lg font-semibold">{player.name}</h3>
          <p>Tag: {player.tag}</p>
          <p>Town Hall: {player.townHallLevel}</p>

          <div className="mt-3">
            <input
              type="text"
              placeholder="Enter verify token"
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              className="w-full rounded border border-white/20 bg-black/30 p-2"
            />
            <button
              onClick={confirmToken}
              className="bg-green-500 px-4 py-2 mt-2 rounded"
            >
              Verify & Link Player
            </button>

            {verifyStatus === "checking" && <p>Checking token...</p>}
            {verifyStatus === "valid" && (
              <p className="text-green-400">Token valid, player linked</p>
            )}
            {verifyStatus === "invalid" && (
              <p className="text-red-400">Invalid token</p>
            )}
            {verifyStatus === "error" && (
              <p className="text-red-400">Error verifying token</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverView;
