// src/pages/Aboute.jsx
const Aboute = () => {
  return (
    <section className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-5xl w-full mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About us</h1>

        <div className="overflow-x-auto mb-12">
          <table className="table-auto w-full border-collapse rounded-2xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-slate-800 text-left">
                <th className="px-6 py-3 text-lg">Feature</th>
                <th className="px-6 py-3 text-lg">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-700/40 hover:bg-slate-700/60 transition">
                <td className="px-6 py-4 font-semibold">Account Management</td>
                <td className="px-6 py-4 text-slate-300">
                  Link your gaming accounts, manage notification preferences, enable advanced security,
                  and stay in control of your profile.
                </td>
              </tr>
              <tr className="bg-slate-800/40 hover:bg-slate-800/60 transition">
                <td className="px-6 py-4 font-semibold">Search Players & Clans</td>
                <td className="px-6 py-4 text-slate-300">
                  Quickly search for players and clans to discover new teammates, communities,
                  and opportunities to grow within your favorite games.
                </td>
              </tr>
              <tr className="bg-slate-700/40 hover:bg-slate-700/60 transition">
                <td className="px-6 py-4 font-semibold">Donation System</td>
                <td className="px-6 py-4 text-slate-300">
                  Support your favorite clans or players directly. Donations help strengthen communities,
                  unlock new features, and keep the ecosystem thriving.
                </td>
              </tr>
              <tr className="bg-slate-800/40 hover:bg-slate-800/60 transition">
                <td className="px-6 py-4 font-semibold">XP & Rewards</td>
                <td className="px-6 py-4 text-slate-300">
                  Earn XP for your activities — such as searching, joining clans, and making donations.
                  Your XP unlocks special rewards and recognition inside the platform.
                </td>
              </tr>
              <tr className="bg-slate-700/40 hover:bg-slate-700/60 transition">
                <td className="px-6 py-4 font-semibold">Safe & Evolving</td>
                <td className="px-6 py-4 text-slate-300">
                  We’re committed to delivering a smooth and secure experience and continuously add
                  new features to give you full control over your data, security, and growth.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Images Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
            <img
              src="\slider8.png" // ضع مسار صورتك الأولى هنا
              alt="Community"
              className="w-full h-64 object-cover"
            />
            <div className="p-4 bg-slate-800">
              <h2 className="text-xl font-semibold mb-2">Join Our Community</h2>
              <p className="text-slate-300 text-sm">
                Connect with players and clans, share strategies and grow together inside Clash.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
            <img
              src="\slider6.png" 
              alt="Donations"
              className="w-full h-64 object-cover"
            />
            <div className="p-4 bg-slate-800">
              <h2 className="text-xl font-semibold mb-2">Support & Donations</h2>
              <p className="text-slate-300 text-sm">
                Support your favorite clans and players. Donations keep our ecosystem thriving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Aboute;
