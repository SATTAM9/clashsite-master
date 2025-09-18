// import { useState, useEffect } from "react";

// const TopClans = () => {
//   const [clans, setClans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);


//   let id = 32000239;

//   useEffect(() => {
//     const getClans = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`http://localhost:8081/clans/${id}`);
//         const mydata = await res.json();

//         const clansData = mydata.items || [];
//         setClans(clansData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching clans:", err);
//         setError("Failed to load clans.");
//         setLoading(false);
//       }
//     };

//     getClans();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error.message}</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6 text-white">Top Clans</h2>
      
//       <ul className="space-y-6">
//         {clans.map((clan) => (
//           <li
//             key={clan.tag}
//             className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
//           >
//             <div className="flex justify-center mb-4">
//               <img
//                 src={clan.badgeUrls?.medium}
//                 alt={clan.name}
//                 className="w-20 h-20 rounded-full border border-gray-600"
//               />
//             </div>

           
            
//             <div className="text-white space-y-1">
//               <p>
//                 <span className="font-semibold">Name:</span> {clan.name}
//               </p>
//               <p>
//                 <span className="font-semibold">Tag:</span> {clan.tag}
//               </p>
//               <p>
//                 <span className="font-semibold">Rank:</span> {clan.rank}
//               </p>
//               <p>
//                 <span className="font-semibold">Previous Rank:</span>{" "}
//                 {clan.previousRank}
//               </p>
//               <p>
//                 <span className="font-semibold">Clan Level:</span>{" "}
//                 {clan.clanLevel}
//               </p>
//               <p>
//                 <span className="font-semibold">Points:</span> {clan.clanPoints}
//               </p>
//               <p>
//                 <span className="font-semibold">Members:</span> {clan.members}
//               </p>
//               <p>
//                 <span className="font-semibold">Location:</span>{" "}
//                 {clan.location?.name || "Unknown"}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TopClans;
