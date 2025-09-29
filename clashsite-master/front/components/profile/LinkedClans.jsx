import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const LinkedClans = () => {
  const [email, setEmail] = useState("");
  const [clanTag, setClanTag] = useState("");
  const [linkedClans, setLinkedClans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // جلب الإيميل من الـ JWT
  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.userInfo.email);
    }
  }, []);

  // جلب بيانات المستخدم بمجرد معرفة الإيميل
  useEffect(() => {
    if (email) {
      fetchUserData();
    }
  }, [email]);

  const fetchUserData = async () => {
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(" import.meta.env.VITE_API_URL/mydata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLinkedClans(data.linkedClans || []);
    } catch (err) {
      console.error(err);
      setMessage("error when fetching user data ");
    }
  };

  // إضافة كلان جديد
  const handleAddClan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(" import.meta.env.VITE_API_URL/addlinkedClans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, clanTag }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("clan added successfully");
        setClanTag("");
        fetchUserData();
      } else {
        setMessage(data.message || "error when add clan");
      }
    } catch (err) {
      setMessage("error when add clan");
    } finally {
      setLoading(false);
    }
  };

  // حذف كلان
  const handleRemoveClan = async (tag) => {
    setLoading(true);
    setMessage("");
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/removelinkedClans`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, clanTag: tag }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage("clan removed successfully");
        fetchUserData();
      } else {
        setMessage(data.message || "error when remove clan");
      }
    } catch (err) {
      setMessage("error when remove clan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        manage linked clans
      </h2>

      {/* عرض الإيميل */}
      <div className="mb-4 text-center">
        <p className="text-sm text-white/80">
          <span className="font-semibold text-white">email:</span> {email}
        </p>
      </div>

      <form
        onSubmit={handleAddClan}
        className="mb-6 flex flex-col gap-3 items-center"
      >
        <input
          type="text"
          className="border border-white/20 bg-black/30 text-white placeholder-white/50 p-2 rounded-lg w-full focus:outline-none focus:ring focus:ring-amber-300"
          placeholder="enter: # Clan Tag"
          value={clanTag}
          onChange={(e) => setClanTag(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? "adding..." : "add clan"}
        </button>
      </form>

      {message && (
        <p className="mb-4 text-center text-sm text-emerald-300">{message}</p>
      )}

      <h3 className="text-lg font-semibold text-white mb-2">linked clans:</h3>
      <ul className="list-none space-y-2">
        {linkedClans.map((c, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between rounded-lg bg-black/30 p-3 border border-white/10 text-white"
          >
            <div className="flex flex-col">
              <span className="font-medium">{c.tag}</span>
              {c.verify ? (
                <span className="text-green-400 text-xs font-semibold">
                  (verified)
                </span>
              ) : (
                <span className="text-red-400 text-xs font-semibold">
                  not verified
                </span>
              )}
            </div>
            <button
              onClick={() => handleRemoveClan(c.tag)}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg transition-colors"
            >
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinkedClans;
