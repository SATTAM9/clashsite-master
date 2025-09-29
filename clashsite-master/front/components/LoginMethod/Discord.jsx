


// import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
// import { useNavigate } from "react-router-dom";
// import { useSignupMutation } from "../app/slices/authSlice";
// import Cookies from "js-cookie";

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE,
//   import.meta.env.VITE_SUPABASE_TOKENT,
//   {
//     auth: {
//       storage: null,
//       persistSession: true,
//     },
//   }
// );

// const Discord = () => {
//   const [localError, setLocalError] = useState("");
//   const navigate = useNavigate();
//   const [signup, { isLoading, error: apiError }] = useSignupMutation();

 
// useEffect(() => {
//   // امسح أي session قديمة
//   supabase.auth.signOut();

//   const {
//     data: { subscription },
//   } = supabase.auth.onAuthStateChange(async (_event, session) => {
//     if (_event === "SIGNED_IN" && session?.user) {
//       try {
//         const result = await signup({
//           email: session.user.email,
//           provider: "discord",
//         });

//         if (result.error) {
//           setLocalError(
//             result.error?.data?.message || "Signup failed. Try again."
//           );
//           return;
//         }

//         const token = result.data?.accessToken;
//         if (token) {
//           Cookies.set("accessToken", token, { path: "/" });
      
//           navigate("/profile");
//         }
//       } catch (err) {
//         console.error("Signup error on sign in:", err);
//         setLocalError("Unexpected error. Please try again.");
//       }
//     } else if (_event === "SIGNED_OUT") {
//       localStorage.removeItem("user");
//       Cookies.remove("accessToken", { path: "/" });
//       navigate("/signup");
//     }
//   });

//   return () => {
//     subscription.unsubscribe();
//   };
// }, [navigate, signup]);


// const handleDiscordLogin = async () => {
//   setLocalError(""); 

//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: "discord",
//     options: { redirectTo: window.location.origin + "/profile" },
//   });

//   if (error) {
//     console.error("Login error:", error.message);
//     setLocalError(error.message);
//   }
// };


//   return (
//     <div className="flex w-full flex-col items-center gap-2">
//       <button
//         type="button"
//         onClick={handleDiscordLogin}
//         disabled={isLoading}
//         className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-indigo-400/40 bg-indigo-500/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300/40 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         <img
//           src="/Discord.jpg"
//           alt="Discord logo"
//           className="h-6 w-6 rounded-full"
//         />
//         <span>{isLoading ? "Creating Account..." : "Continue with Discord"}</span>
//       </button>
      
//       {/* عرض الأخطاء زي SignUp */}
//       {localError && (
//         <div className="rounded-2xl bg-red-500/15 border border-red-500/20 p-3 text-sm font-medium text-red-200 w-full">
//           {localError}
//         </div>
//       )}

//       {apiError && !localError && (
//         <div className="rounded-2xl bg-red-500/15 border border-red-500/20 p-3 text-sm font-medium text-red-200 w-full">
//           {typeof apiError === "string"
//             ? apiError
//             : apiError.data?.message ||
//               "An error occurred during signup"}
//         </div>
//       )}
//     </div>
//   );
// }
// export default Discord;

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../app/slices/authSlice";
import Cookies from "js-cookie";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE,
  import.meta.env.VITE_SUPABASE_TOKENT,
  {
    auth: {
      storage: null,
      persistSession: true,
    },
  }
);

const Discord = () => {
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const [signup, { isLoading, error: apiError }] = useSignupMutation();

  // Debug: check initial render
  console.log("Discord component rendered");

  useEffect(() => {
    console.log("useEffect triggered");

    // لا تمسح الـ session إلا لو فعلاً محتاج
    supabase.auth.getSession().then(({ data }) => {
      console.log("Current session:", data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session);

        if (_event === "SIGNED_IN" && session?.user) {
          console.log("SIGNED_IN event detected");

          // Only signup if no access token exists
          if (!Cookies.get("accessToken")) {
            try {
              console.log("Calling signup mutation...");
              const result = await signup({
                email: session.user.email,
                provider: "discord",
              });
              console.log("Signup result:", result);

              if (result.error) {
                setLocalError(result.error?.data?.message || "Signup failed");
                return;
              }

              const token = result.data?.accessToken;
              if (token) {
                Cookies.set("accessToken", token, { path: "/" });
                console.log("Token set in cookie:", token);
                navigate("/profile");
              }
            } catch (err) {
              console.error("Unexpected signup error:", err);
              setLocalError("Unexpected error. Please try again.");
            }
          } else {
            console.log("Access token already exists, skipping signup");
          }
        } else if (_event === "SIGNED_OUT") {
          console.log("SIGNED_OUT event detected");
          localStorage.removeItem("user");
          Cookies.remove("accessToken", { path: "/" });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      console.log("Unsubscribed from auth state changes");
    };
  }, [navigate, signup]);

  const handleDiscordLogin = async () => {
    console.log("handleDiscordLogin called");
    setLocalError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: { redirectTo: window.location.origin + "/profile" },
      });
      if (error) {
        console.error("Login error:", error.message);
        setLocalError(error.message);
      } else {
        console.log("OAuth redirect initiated");
      }
    } catch (err) {
      console.error("OAuth unexpected error:", err);
      setLocalError("Unexpected error. Please try again.");
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleDiscordLogin}
        disabled={isLoading}
        className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-indigo-400/40 bg-indigo-500/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <img
          src="/Discord.jpg"
          alt="Discord logo"
          className="h-6 w-6 rounded-full"
        />
        <span>{isLoading ? "Creating Account..." : "Continue with Discord"}</span>
      </button>

      {localError && (
        <div className="rounded-2xl bg-red-500/15 border border-red-500/20 p-3 text-sm font-medium text-red-200 w-full">
          {localError}
        </div>
      )}

      {apiError && !localError && (
        <div className="rounded-2xl bg-red-500/15 border border-red-500/20 p-3 text-sm font-medium text-red-200 w-full">
          {typeof apiError === "string"
            ? apiError
            : apiError.data?.message || "An error occurred during signup"}
        </div>
      )}
    </div>
  );
};

export default Discord;



// عايز اعرف اي المسبب للمشاكل دي زي اني لما باجي اجيب صفحه ال signup بيسجل signup لوحده وهندلي اي ايروور واعمل كونسول لوج في كل حته