// import { useEffect, useState } from "react";

// import TapPlayer from "./ui/TapPlayer";
// import { RiLogoutCircleRFill } from "react-icons/ri";

// const YourAccount = () => {
//   const [userTag, setUserTag] = useState(localStorage.getItem("userTag") || "");
//   const [inputTag, setInputTag] = useState("");
//   const [playerData, setPlayerData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   // const [user, setUser] = useState(localStorage.getItem("userTag"));

//   const fetchPlayerData = async (tag) => {
//     try {
//       setLoading(true);
//       setError("");
//       const res = await fetch("http://localhost:8081/playerbytag", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ tag: `#${tag}` }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setPlayerData(data.playerInfo);
//         return true;
//       } else {
//         setError("Invalid player tag.");
//         return false;
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching player details.");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userTag) fetchPlayerData(userTag);
//   }, [userTag]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const cleanTag = inputTag.trim().replace("#", "");
//     if (cleanTag) {
//       const isValid = await fetchPlayerData(cleanTag);
//       if (isValid) {
//         localStorage.setItem("userTag", cleanTag);
//         setUserTag(cleanTag);
//         setInputTag("");
//       }
//     }
//   };

//   const handleLogout = () => {
//     console.log(localStorage.getItem("userTag"));
//     localStorage.removeItem("userTag");
//     console.log(localStorage.getItem("userTag"));
//     window.location.reload();
//   };

//   if (!userTag) {
//     return (
//       <div className="relative min-h-screen flex flex-col items-center justify-center text-white">
//         <div
//           className="absolute inset-0 bg-cover bg-center opacity-30"
//           style={{ backgroundImage: `url('/logo.png')` }}
//         ></div>

//         <div className="relative z-10 bg-black/70 p-8 rounded-2xl shadow-2xl text-center w-96">
//           <img
//             src={"/fic.jpeg"}
//             alt="Clash"
//             className="mx-auto w-20 mb-4 animate-bounce"
//           />
//           <h2 className="text-2xl font-bold text-yellow-400 mb-4">
//             Enter Your Player Tag
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               value={inputTag}
//               onChange={(e) => setInputTag(e.target.value)}
//               placeholder="#YourTag"
//               className="w-full p-3 bg-white rounded-lg text-black outline-none focus:ring-4 focus:ring-yellow-400"
//             />
//             <button
//               type="submit"
//               className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg shadow-md transition-all"
//             >
//               Save Tag
//             </button>
//           </form>
//           {error && <p className="text-red-500 mt-3">{error}</p>}
//         </div>
//       </div>
//     );
//   }

//   if (loading)
//     return (
//       <div className="text-center text-yellow-300">Loading player info...</div>
//     );
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center text-white">
//       <div
//         className="absolute inset-0 bg-cover bg-center opacity-30"
//         style={{ backgroundImage: `url('/logo.png')` }}
//       ></div>

//       <button
//         onClick={() => handleLogout()}
//         className=" cursor-pointer rounded-full z-10 transition"
//       >
//         <RiLogoutCircleRFill className="text-[60px]  hover:text-red-500  text-yellow-300 w-full " />
//       </button>

//       <div className="p-6 bg-gradient-to-r mt-3 from-gray-900 via-gray-800 to-gray-900 z-10 text-white rounded-2xl shadow-2xl max-w-5xl mx-auto">
//         {/* Player Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-extrabold mb-2">
//             {playerData?.name || "Unknown Player"}
//           </h1>
//         </div>

//         {/* Clan Section */}
//         <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-4">
//           <img
//             src={playerData?.clan?.badge?.url}
//             alt="Clan Badge"
//             className="w-20 h-20 rounded-full shadow-lg border-2 border-yellow-400"
//           />
//           <div>
//             <h2 className="text-3xl font-bold">{playerData?.clan?.name}</h2>
//             <p className="text-gray-400">
//             </p>
//           </div>
//         </div>

//         {/* Player Info */}
//         <h3 className="text-xl font-semibold mb-4">Player Info</h3>
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//           <InfoCard
//             label="Town Hall"
//             value={playerData?.townHallLevel}
//           />
//           <InfoCard
//             label="Defense Wins"
//             value={playerData?.defenseWins}
//           />
//         </div>

//         {/* Builder Base */}
//         <h3 className="text-xl font-semibold mb-4">Builder Base</h3>
//         <div className="grid grid-cols-2 gap-4">
//           <InfoCard
//             label="Builder Hall"
//             value={playerData?.builderHallLevel}
//           />
//           <InfoCard
//             label="Builder Trophies"
//             value={playerData?.builderBaseTrophies}
//           />
//         </div>
//       </div>

//       {/* Tabs Section */}
//       <TapPlayer />
//     </div>
//   );
// };

// //   <div className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
// //     <p className="text-lg">
// //       {icon} {value || 0}
// //     </p>
// //     <p className="text-sm text-gray-400">{label}</p>
// //   </div>
// // );
// const InfoCard = ({ label, value, icon }) => (
//   <div className="bg-gradient-to-br  from-gray-900 to-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700/50 hover:border-yellow-400/40 transition-all transform hover:scale-105 hover:shadow-yellow-400/20 text-center">
//     <p className="text-2xl font-extrabold text-yellow-300 drop-shadow-md">
//       {icon} {value || 0}
//     </p>
//     <p className="text-sm text-gray-300 mt-2">{label}</p>
//   </div>
// );
// export default YourAccount;

import React from "react";

const Login = () => {
  return (
    <div className="text-white">

      <img
        src={"/fic.jpeg"}
        loading="lazy"
        alt="Clash"
        className="mx-auto w-20 mb-4 animate-bounce"
      />
    </div>
  );
};

export default Login;
