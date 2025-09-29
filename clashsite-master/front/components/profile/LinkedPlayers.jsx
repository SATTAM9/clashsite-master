import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const LinkedPlayers = ({ refresh }) => {
  const [linkedPlayers, setLinkedPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("accessToken");
  const decoded = jwtDecode(token);
  const email = decoded.userInfo.email;

  const fetchLinkedPlayers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/mydata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to fetch linked players");
      const data = await res.json();
      setLinkedPlayers(data.linkedPlayers || []);
    } catch (err) {
      console.error(err);
      setLinkedPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkedPlayers();
  }, [refresh]);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-5">Linked Players</h2>

      {loading ? (
        <p>Loading...</p>
      ) : linkedPlayers.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {linkedPlayers.map((lp, index) => (
            <li key={index}>
              <Link
                to={`/player/${lp.replace(/^#/, "")}`}
                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900/90 p-5 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-200"
              >
                <span className="text-2xl sm:text-3xl">🎮</span>
                <span className="text-lg sm:text-xl font-semibold text-white break-all">
                  {lp}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No linked players yet.</p>
      )}
    </div>
  );
};

export default LinkedPlayers;
