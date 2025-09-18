


// // import { useState } from "react";
// // import { useSearchParams } from "react-router-dom";

// // const ResetPassword = () => {
// //   const [searchParams] = useSearchParams();
// //   const token = searchParams.get("token"); 
// //   const [message, setMessage] = useState("");
// //   const [newPassword, setNewPassword] = useState("");

// //   const handleReset = async () => {
// //     try {
// //       const res = await fetch("http://localhost:8081/addnewpassword", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ token, password: newPassword }),
// //       });

// //       const data = await res.json();
// //       setMessage(data.m || data.message || "Something went wrong");
// //     } catch (err) {
// //       console.error(err);
// //       setMessage("Error connecting to server");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
// //       <div className="bg-gray-800/90 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
// //         <h1 className="text-3xl font-bold text-yellow-400 mb-6">
// //           Reset Your Password
// //         </h1>

// //         <input
// //           type="password"
// //           placeholder="Enter new password"
// //           value={newPassword}
// //           onChange={(e) => setNewPassword(e.target.value)}
// //           className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
// //         />

// //         <button
// //           onClick={handleReset}
// //           className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg shadow-md transition-all"
// //         >
// //           Save New Password
// //         </button>

// //         {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ResetPassword;

// import { useEffect } from "react";
// import { useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";


// const ResetPassword = () => {
//        const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get("token"); 
//   const [message, setMessage] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//     const [passwordsMatch, setPasswordsMatch] = useState(false);

//     useEffect(() => {
//       setPasswordsMatch(newPassword !== "" && newPassword === confirmPassword);
//     }, [newPassword, confirmPassword]);
  

//       const isFormValid = () => {
//     // Basic checks before enabling submit
//     return (
//       newPassword.trim() !== "" &&
//       confirmPassword.trim() !== "" &&
//       // name.trim() !== "" &&
//       // id2.trim() !== "" &&
//       passwordsMatch &&
//       newPassword.length >= 6
//     );
//   };

//   const handleReset = async () => {
//     if (newPassword !== confirmPassword) {
//       setMessage("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:8081/addnewpassword", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, password: newPassword }),
//       });

//       const data = await res.json();
//       setMessage(data.m || data.message || "Something went wrong");
//     } catch (err) {
//       console.error(err);
//       setMessage("Error connecting to server");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
//       <div className="bg-gray-800/90 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
//         <h1 className="text-3xl font-bold text-yellow-400 mb-6">
//           Reset Your Password
//         </h1>

//         <input
//           type="password"
//           placeholder="Enter new password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
//         />

//         <input
//           type="password"
//           placeholder="Confirm new password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
//         />

//         <button
//           onClick={handleReset}
//           className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg shadow-md transition-all"
//         >
//           Save New Password
//         </button>

//         {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;



import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const sanitizeUser = (payload) => {
  if (!payload) {
    return null;
  }

  const safeUser = {
    email: payload.email || "",
  };

  if (payload.name) {
    safeUser.name = payload.name;
  }
  if (payload.id2) {
    safeUser.id2 = payload.id2;
  }
  if (payload.verifyEmail !== undefined) {
    safeUser.verifyEmail = payload.verifyEmail;
  }
  if (payload._id) {
    safeUser._id = payload._id;
  }

  return safeUser;
};


const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(token)

  useEffect(() => {
    setPasswordsMatch(
      newPassword !== "" && newPassword === confirmPassword
    );
  }, [newPassword, confirmPassword]);

  const isFormValid = () => {
    return (
      newPassword.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      passwordsMatch &&
      newPassword.length >= 6
    );
  };

  const handleReset = async () => {
    if (!isFormValid()) {
      setMessage("Passwords must match and be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/addnewpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const data = await res.json();
            if (res.ok) {
        setMessage("Password changed successfully");
        const safeUser = sanitizeUser(data.user);
        if (safeUser) {
          localStorage.setItem("user", JSON.stringify(safeUser));
        }

        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMessage(data.m || data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="bg-gray-800/90 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">
          Reset Your Password
        </h1>

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />

        <button
          onClick={handleReset}
          disabled={!isFormValid() || loading}
          className={`w-full text-black font-bold py-3 rounded-lg shadow-md transition-all ${
            isFormValid()
              ? "bg-yellow-500 hover:bg-yellow-400"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "Saving..." : "Save New Password"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
