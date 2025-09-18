// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// const PlayerProfile = () => {
//   const [playerTag, setPlayerTag] = useState("");
//   const [token, setToken] = useState("");
//   const [player, setPlayer] = useState(null);

//   const [linkedPlayers, setLinkedPlayers] = useState(() => {
//     const saved = localStorage.getItem("linkedPlayers");
//     return saved ? JSON.parse(saved) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem("linkedPlayers", JSON.stringify(linkedPlayers));
//   }, [linkedPlayers]);

//   const handleLinkedClick = (p) => {
//     setPlayer(p);
//     setPlayerTag(p.tag);
//   };

//   const handleSearch = async () => {
//     const res = await fetch("http://localhost:8081/playerbytag", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ tag: playerTag }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       setPlayer(data.playerInfo);
//     } else {
//       alert("Player not found");
//     }
//   };

//   const handleVerifyAndLink = async () => {
//     const cleanTag = playerTag.replace("#", "");
//     const res = await fetch(
//       `http://localhost:8081/players/${cleanTag}/verifytoken`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token }),
//       }
//     );
//     const data = await res.json();
//     if (data.status === "ok") {
//       const newPlayers = [...linkedPlayers, player];
//       setLinkedPlayers((prev) => [...prev, player]);
//       // localStorage.setItem("linkedPlayers", JSON.stringify(linkedPlayers));
//       localStorage.setItem("linkedPlayers", JSON.stringify(newPlayers));
//       alert("Player linked!");
//     } else {
//       alert(data.status);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {/* linked players */}
//       <div className="mb-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl">
//         <h3 className="text-3xl font-extrabold text-white mb-6">
//           Linked Players
//         </h3>
//         <div className="flex gap-3 flex-wrap">
//           {linkedPlayers.map((p) => (
//             <Link
//               key={p.tag}
//               to={`/player/${p.tag.replace("#", "")}`}
//               onClick={() => handleLinkedClick(p)}
//               className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-md transition transform hover:-translate-y-0.5"
//             >
//               {p.name} <span className="opacity-80">({p.tag})</span>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* البحث */}
//       <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl">
//         <h2 className="text-3xl font-bold mb-6 text-white">Player Search</h2>
//         <div className="flex gap-3 mb-4">
//           <input
//             type="text"
//             placeholder="Enter your Player Tag"
//             value={playerTag}
//             onChange={(e) => setPlayerTag(e.target.value)}
//             className="flex-1 p-4 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={handleSearch}
//             className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
//           >
//             Search
//           </button>
//         </div>

//         {player && (
//           <div className="mt-6 bg-gray-900 p-6 rounded-2xl shadow-inner">
//             <div className="flex items-center gap-4 mb-4">
//               {player.clan?.badgeUrls?.small && (
//                 <img
//                   src={player.clan?.badgeUrls?.small}
//                   alt="badge"
//                   className="w-14 h-14 rounded-xl"
//                 />
//               )}
//               <div>
//                 <p className="text-2xl font-semibold text-white">
//                   {player.name}
//                 </p>
//                 <p className="text-sm text-gray-400">{player.tag}</p>
//               </div>
//             </div>

//             {/* إدخال التوكن للتحقق */}
//             <input
//               type="text"
//               placeholder="Enter API token"
//               value={token}
//               onChange={(e) => setToken(e.target.value)}
//               className="w-full p-4 mb-3 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//             <button
//               onClick={handleVerifyAndLink}
//               className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition"
//             >
//               Verify & Link Player
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PlayerProfile;


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const PlayerProfile = () => {
  const [playerTag, setPlayerTag] = useState("");
  const [token, setToken] = useState("");
  const [player, setPlayer] = useState(null);

  const [linkedPlayers, setLinkedPlayers] = useState(() => {
    const saved = localStorage.getItem("linkedPlayers");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("linkedPlayers", JSON.stringify(linkedPlayers));
  }, [linkedPlayers]);

  const handleLinkedClick = (p) => {
    setPlayer(p);
    setPlayerTag(p.tag);
  };

  const handleSearch = async () => {
    const res = await fetch("http://localhost:8081/playerbytag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag: playerTag }),
    });
    const data = await res.json();
    if (data.success) {
      setPlayer(data.playerInfo);
    } else {
      alert("Player not found");
    }
  };

  const handleVerifyAndLink = async () => {
    const cleanTag = playerTag.replace("#", "");
    const res = await fetch(
      `http://localhost:8081/players/${cleanTag}/verifytoken`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }
    );
    const data = await res.json();
    if (data.status === "ok") {
      const newPlayers = [...linkedPlayers, player];
      setLinkedPlayers((prev) => [...prev, player]);
      localStorage.setItem("linkedPlayers", JSON.stringify(newPlayers));
      alert("Player linked!");
    } else {
      alert(data.status);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      {/* linked players */}
      <div className="mb-10 bg-gradient-to-tr from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl p-8 shadow-2xl border border-indigo-700">
        <h3 className="text-4xl font-extrabold text-white mb-6 tracking-wide">
          Linked Players
        </h3>
        <div className="flex gap-4 flex-wrap">
          {linkedPlayers.map((p) => (
            <Link
              key={p.tag}
              to={`/player/${p.tag.replace("#", "")}`}
              onClick={() => handleLinkedClick(p)}
              className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="font-semibold">{p.name}</span>{" "}
              <span className="text-sm opacity-80">({p.tag})</span>
            </Link>
          ))}
        </div>
      </div>

      {/* البحث */}
      <div className="bg-gradient-to-tr from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
        <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 tracking-wide">
          Player Search
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter your Player Tag"
            value={playerTag}
            onChange={(e) => setPlayerTag(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-inner"
          />
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-2xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            Search
          </button>
        </div>

        {player && (
          <div className="mt-8 bg-gray-900 p-6 rounded-3xl shadow-inner border border-gray-700">
            <div className="flex items-center gap-5 mb-6">
              {player.clan?.badgeUrls?.small && (
                <img
                  src={player.clan?.badgeUrls?.small}
                  alt="badge"
                  className="w-16 h-16 rounded-2xl shadow-md"
                />
              )}
              <div>
                <p className="text-3xl font-bold text-white">{player.name}</p>
                <p className="text-md text-gray-400">{player.tag}</p>
              </div>
            </div>

            {/* إدخال التوكن للتحقق */}
            <input
              type="text"
              placeholder="Enter API token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full p-4 mb-4 rounded-2xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500 shadow-inner"
            />
            <button
              onClick={handleVerifyAndLink}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              Verify & Link Player
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;
