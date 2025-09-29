import { useEffect, useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaUsers,
  FaUserShield,
  FaUserTie,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editPlayers, setEditPlayers] = useState("");

  const token = Cookies.get("accessToken");

  // جلب كل المستخدمين
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(" import.meta.env.VITE_API_URL/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  // حذف المستخدم
  const handleDelete = async (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(" import.meta.env.VITE_API_URL/delete-user", {
        data: { email },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers((prev) => prev.filter((u) => u.email !== email));
    } catch (err) {
      console.error(err);
    }
  };

  // فتح الـ modal للتعديل
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditPlayers(user.linkedPlayers?.join(", ") || "");
  };

  // حفظ التعديلات
  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/update-user`,
        {
          email: editingUser.email,
          role: editRole,
          linkedPlayers: editPlayers
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p !== ""),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // تعديل الـ state بعد التحديث
      setUsers((prev) =>
        prev.map((u) => (u.email === editingUser.email ? res.data.user : u))
      );
      // قفل المودال
      setEditingUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  // تأكيد الكلان Tag لمستخدم محدد
  const handleVerifyClanTag = async (email, clanTag) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/verifyClanTag`,
        { email, clanTag },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // تحديث اليوزر بعد الـ verify
      const updatedUser = res.data;
      setUsers((prev) =>
        prev.map((u) =>
          u.email === email ? { ...u, linkedClans: updatedUser.linkedClans } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error verifying clan tag");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="text-purple-400" />;
      case "client":
        return <FaUserTie className="text-blue-400" />;
      default:
        return <FaUsers className="text-gray-400" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      client: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    };
    return (
      styles[role] || "bg-gray-500/20 text-gray-300 border border-gray-500/30"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        <p className="text-slate-400 ml-3">Loading users…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FaUsers className="text-sky-400" />
            User Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage system users and their permissions
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 px-4 py-2 text-center">
            <div className="text-lg font-bold text-white">{users.length}</div>
            <div className="text-xs text-slate-400">Total Users</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/30 px-4 py-2 text-center">
            <div className="text-lg font-bold text-purple-300">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <div className="text-xs text-slate-400">Admins</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-white/10 bg-slate-950/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  User Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Linked Clans
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-white/2 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.linkedClans && user.linkedClans.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {user.linkedClans.map((clan, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded bg-slate-900 gap-2 px-2 py-1 text-xs text-slate-300"
                          >
                            <span className="flex items-center gap-4">
                              {clan.tag}{" "}
                              {clan.verify ? (
                                <span className="text-green-400 font-semibold">
                                  (verified)
                                </span>
                              ) : (
                                <span className="text-red-400 font-semibold">
                                  (not verified)
                                </span>
                              )}
                            </span>
                            {!clan.verify && (
                              <button
                                onClick={() =>
                                  handleVerifyClanTag(user.email, clan.tag)
                                }
                                className="flex items-center gap-1 rounded bg-green-500 px-2 py-0.5 text-white hover:bg-green-400"
                              >
                                <FaCheckCircle size={10} />
                                Verify
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 text-sm">
                        No linked clans
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <FaEdit size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user.email)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      >
                        <FaTrash size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="px-6 py-12 text-center">
              <FaUsers className="mx-auto h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg font-medium">
                No users found
              </p>
              <p className="text-slate-500 text-sm">
                Users will appear here once they register
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaEdit className="text-blue-400" />
                Edit User
              </h2>
              <p className="text-sm text-slate-400 mt-1">{editingUser.email}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Linked Players
                  <span className="text-slate-500 font-normal">
                    {" "}
                    (comma separated)
                  </span>
                </label>
                <textarea
                  value={editPlayers}
                  onChange={(e) => setEditPlayers(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="Enter player names separated by commas..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-4">
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="rounded-lg bg-sky-500 px-4 py-2 font-semibold text-white transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
