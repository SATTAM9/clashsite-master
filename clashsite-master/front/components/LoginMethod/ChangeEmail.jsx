import { useState } from "react";

const ChangeEmail = () => {
  const currentEmail = localStorage.getItem("user");
  const currentUser = JSON.parse(currentEmail);

  //to parent
  //  const [email, setEmail] = useState("");

  const [newEmail, setNewEmail] = useState(currentUser.email);
  const [message, setMessage] = useState("");
  const [loadingGhangeEmail, setLoadingGhangeEmail] = useState(false);

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoadingGhangeEmail(true);

    try {
      const res = await fetch("http://localhost:8081/updateEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localEmail: currentUser.email,
          newEmail: newEmail,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Email updated successfully");
        setLoadingGhangeEmail(false);
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    } finally {
      setLoadingGhangeEmail(false);
    }
  };

  //====================

  return (
    <div>
      <form
        onSubmit={handleChangeEmail}
        className="w-full mx-auto p-4 bg-gray-800 rounded-xl shadow-lg"
      >
        <input
          type="email"
          placeholder="new email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full mb-3 p-3 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <div className="flex justify-end ">
          <button
            type="submit"
            disabled={loadingGhangeEmail}
            className={`w-fit p-3 font-bold text-black rounded-lg shadow-md ${
              loadingGhangeEmail
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loadingGhangeEmail ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {message && <p className="mt-3 text-sm text-gray-300">{message}</p>}
      </form>
    </div>
  );
};

export default ChangeEmail;
