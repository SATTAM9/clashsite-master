// // src/pages/Aboute.jsx
// const Aboute = () => {
//   return (
//     <section className="min-h-screen bg-slate-900 text-white px-4 py-10">
//       <div className="max-w-5xl w-full mx-auto">
//         <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">About us</h1>

//         <div className="overflow-x-auto mb-12">
//           <table className="table-auto w-full border-collapse rounded-2xl overflow-hidden shadow-lg">
//             <thead>
//               <tr className="bg-slate-800 text-left">
//                 <th className="px-6 py-3 text-lg">Feature</th>
//                 <th className="px-6 py-3 text-lg">Description</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="bg-slate-700/40 hover:bg-slate-700/60 transition">
//                 <td className="px-6 py-4 font-semibold">Account Management</td>
//                 <td className="px-6 py-4 text-slate-300">
//                   Link your gaming accounts, manage notification preferences, enable advanced security,
//                   and stay in control of your profile.
//                 </td>
//               </tr>
//               <tr className="bg-slate-800/40 hover:bg-slate-800/60 transition">
//                 <td className="px-6 py-4 font-semibold">Search Players & Clans</td>
//                 <td className="px-6 py-4 text-slate-300">
//                   Quickly search for players and clans to discover new teammates, communities,
//                   and opportunities to grow within your favorite games.
//                 </td>
//               </tr>
//               <tr className="bg-slate-700/40 hover:bg-slate-700/60 transition">
//                 <td className="px-6 py-4 font-semibold">Donation System</td>
//                 <td className="px-6 py-4 text-slate-300">
//                   Support your favorite clans or players directly. Donations help strengthen communities,
//                   unlock new features, and keep the ecosystem thriving.
//                 </td>
//               </tr>
//               <tr className="bg-slate-800/40 hover:bg-slate-800/60 transition">
//                 <td className="px-6 py-4 font-semibold">XP & Rewards</td>
//                 <td className="px-6 py-4 text-slate-300">
//                   Earn XP for your activities — such as searching, joining clans, and making donations.
//                   Your XP unlocks special rewards and recognition inside the platform.
//                 </td>
//               </tr>
//               <tr className="bg-slate-700/40 hover:bg-slate-700/60 transition">
//                 <td className="px-6 py-4 font-semibold">Safe & Evolving</td>
//                 <td className="px-6 py-4 text-slate-300">
//                   We’re committed to delivering a smooth and secure experience and continuously add
//                   new features to give you full control over your data, security, and growth.
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* Images Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
//             <img
//               src="\slider8.png" // ضع مسار صورتك الأولى هنا
//               alt="Community"
//               className="w-full h-64 object-cover"
//             />
//             <div className="p-4 bg-slate-800">
//               <h2 className="text-xl font-semibold mb-2">Join Our Community</h2>
//               <p className="text-slate-300 text-sm">
//                 Connect with players and clans, share strategies and grow together inside Clash.
//               </p>
//             </div>
//           </div>

//           <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
//             <img
//               src="\slider6.png" 
//               alt="Donations"
//               className="w-full h-64 object-cover"
//             />
//             <div className="p-4 bg-slate-800">
//               <h2 className="text-xl font-semibold mb-2">Support & Donations</h2>
//               <p className="text-slate-300 text-sm">
//                 Support your favorite clans and players. Donations keep our ecosystem thriving.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Aboute;


import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

/**
 * AboutPage.jsx — ClashVIP.io
 * - Bilingual (AR/EN) About page
 * - Tailwind UI, SEO via react-helmet
 * - Feature table, mission, community CTAs, legal notice footer
 * - Drop into: src/pages/AboutPage.jsx
 * - Route: <Route path="/about" element={<AboutPage />} />
 */

export default function Aboute() {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    const pref = (navigator.language || "").toLowerCase();
    if (pref.startsWith("ar")) setLang("ar");
    else if (pref.startsWith("en")) setLang("en");
  }, []);

  const t = translations[lang];

  return (
    <main className="min-h-screen bg-[#0d1b2a] text-white">
      <Helmet>
        <html lang={lang} />
        <title>{lang === "ar" ? "من نحن – ClashVIP.io" : "About – ClashVIP.io"}</title>
        <meta
          name="description"
          content={
            lang === "ar"
              ? "ClashVIP.io منصة غير رسمية لعشاق كلاش: إحصائيات، تبرعات، ترتيب العشائر واللاعبين، ومجتمع نشط."
              : "ClashVIP.io is an unofficial fan platform for Clash of Clans: stats, donations, clan & player rankings, and an active community."
          }
        />
        <link rel="canonical" href="https://clashvip.io/about" />
        <meta property="og:title" content={lang === "ar" ? "من نحن – ClashVIP.io" : "About – ClashVIP.io"} />
        <meta property="og:description" content={lang === "ar" ? "تعرف على رؤيتنا وميزات ClashVIP.io ودعم المجتمع." : "Learn about ClashVIP.io's mission, features, and community support."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://clashvip.io/about" />
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{t.h1}</h1>
            <p className="mt-2 text-[15px] text-slate-300 max-w-2xl">{t.tagline}</p>
          </div>
          <LangToggle lang={lang} setLang={setLang} />
        </header>

        {/* Mission / Who we are */}
        <section dir={lang === "ar" ? "rtl" : "ltr"} className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h2 className="text-xl font-bold mb-2">{t.blocks.mission.h}</h2>
            <p className="text-slate-200 text-sm leading-6">{t.blocks.mission.p}</p>
          </Card>
          <Card>
            <h2 className="text-xl font-bold mb-2">{t.blocks.values.h}</h2>
            <ul className="list-disc ps-5 space-y-1 text-slate-200 text-sm leading-6">
              {t.blocks.values.items.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="text-xl font-bold mb-2">{t.blocks.founder.h}</h2>
            <p className="text-slate-200 text-sm leading-6">{t.blocks.founder.p}</p>
          </Card>
        </section>

        {/* Features table */}
        <section dir={lang === "ar" ? "rtl" : "ltr"} className="mb-10">
          <div className="rounded-3xl bg-[#14213d]/60 backdrop-blur border border-white/10 overflow-hidden">
            <div className="grid grid-cols-2 gap-0 p-4 text-sm font-semibold text-slate-200">
              <div>{t.table.feature}</div>
              <div>{t.table.desc}</div>
            </div>
            <hr className="border-white/10" />
            <ul>
              {t.rows.map((r, i) => (
                <li key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-5 border-b border-white/5 last:border-b-0">
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-slate-200 text-sm leading-6">{r.body}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Community & Support */}
        <section dir={lang === "ar" ? "rtl" : "ltr"} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <img src={t.images.community} alt="community" className="w-full h-44 object-cover rounded-xl mb-4" />
            <h3 className="text-lg font-bold mb-1">{t.community.h}</h3>
            <p className="text-slate-200 text-sm mb-3">{t.community.p}</p>
            <div className="flex flex-wrap gap-2">
              <a href="https://discord.gg/clashvip" target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-emerald-500/90 hover:bg-emerald-500 text-white text-sm">Discord</a>
              <a href="https://t.me/clashvip" target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-sky-500/90 hover:bg-sky-500 text-white text-sm">Telegram</a>
              <a href="https://www.youtube.com/@clashvip" target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white text-sm">YouTube</a>
            </div>
          </Card>

          <Card>
            <img src={t.images.support} alt="support" className="w-full h-44 object-cover rounded-xl mb-4" />
            <h3 className="text-lg font-bold mb-1">{t.support.h}</h3>
            <p className="text-slate-200 text-sm mb-3">{t.support.p}</p>
            <div className="flex gap-2">
              <a href="/donate" className="px-3 py-1 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-white text-sm">{t.actions.donate}</a>
              <a href="/contact" className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm">{t.actions.contact}</a>
            </div>
          </Card>
        </section>

        {/* Legal Notice */}
        <footer dir={lang === "ar" ? "rtl" : "ltr"} className="mt-12 rounded-2xl border border-amber-300 bg-amber-50/10 text-amber-200 p-5">
          <p className="text-sm leading-6">
            {t.legal.line1} {" "}
            <a className="underline hover:no-underline text-amber-200" href="https://supercell.com/en/fan-content-policy/" target="_blank" rel="noreferrer">
              Supercell Fan Content Policy
            </a>.
          </p>
          <p className="mt-2 text-xs">{t.legal.author}</p>
        </footer>
      </div>
    </main>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm">
      {children}
    </div>
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
      <button
        onClick={() => setLang("ar")}
        className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
          lang === "ar" ? "bg-white text-[#0d1b2a]" : "text-white hover:bg-white/10"
        }`}
        aria-pressed={lang === "ar"}
      >
        العربية
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
          lang === "en" ? "bg-white text-[#0d1b2a]" : "text-white hover:bg-white/10"
        }`}
        aria-pressed={lang === "en"}
      >
        English
      </button>
    </div>
  );
}

const translations = {
  ar: {
    h1: "من نحن – ClashVIP",
    tagline:
      "منصة غير رسمية لعشاق كلاش تجمع الإحصائيات وتتبع التبرعات وترتيب العشائر واللاعبين مع مجتمع نشط ودعم مستمر.",
    table: { feature: "الميزة", desc: "الوصف" },
    rows: [
      { title: "إدارة الحسابات", body: "اربط حساباتك، فعّل الأمان المتقدم، وخصص التنبيهات وسيطر على ملفك الشخصي." },
      { title: "البحث عن اللاعبين والعشائر", body: "ابحث بسرعة عن لاعبين وعشائر لاكتشاف زملاء جدد ومجتمعات وفرص للنمو." },
      { title: "نظام التبرعات", body: "ادعم عشيرتك أو اللاعبين مباشرة — التبرعات تقوّي المجتمع وتفتح ميزات جديدة." },
      { title: "النقاط والمكافآت (XP)", body: "اكسب نقاطًا لنشاطاتك (بحث، انضمام، تبرعات). نقاطك تفتح مكافآت وتميّز داخل المنصة." },
      { title: "أمان يتطور باستمرار", body: "نلتزم بتجربة آمنة وسلسة مع تطوير مستمر يمنحك تحكمًا كاملاً ببياناتك ونموك." },
    ],
    blocks: {
      mission: { h: "رسالتنا", p: "نبني أفضل تجربة لعشاق Clash عبر أدوات موثوقة وسهلة — لتحليل الأداء، دعم العشائر، وإبراز المجتمع." },
      values: { h: "قيمنا", items: ["الشفافية", "الأمان", "خدمة المجتمع", "التحسين المستمر"] },
      founder: { h: "عن المؤسس", p: "سطام — مؤسس ClashVIP.io ومتابع شغوف للعبة، يعمل على تطوير المنصة مع المجتمع خطوة بخطوة." },
    },
    community: { h: "انضم إلى مجتمعنا", p: "تواصل مع اللاعبين والعشائر، شارك الاستراتيجيات، وانمُ معنا داخل Clash." },
    support: { h: "الدعم والتبرعات", p: "تبرعاتك تُبقي المنظومة حيّة وتساعدنا على إطلاق ميزات جديدة للمجتمع." },
    actions: { donate: "ادعم الآن", contact: "تواصل معنا" },
    legal: {
      line1: "هذا المحتوى غير رسمي وغير مدعوم من Supercell. لمزيد من التفاصيل، راجع",
      author: "المالك والمؤسس: سطام – © 2025 ClashVIP.io جميع الحقوق محفوظة",
    },
    images: {
      community: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1200&auto=format&fit=crop",
      support: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1200&auto=format&fit=crop",
    },
  },
  en: {
    h1: "About – ClashVIP",
    tagline:
      "An unofficial fan platform bringing stats, donations, and clan/player rankings together with an active community.",
    table: { feature: "Feature", desc: "Description" },
    rows: [
      { title: "Account Management", body: "Link your accounts, enable advanced security, customize notifications, and stay in control of your profile." },
      { title: "Search Players & Clans", body: "Quickly find players and clans to discover teammates, communities, and growth opportunities." },
      { title: "Donation System", body: "Support your favorite clans or players directly — donations strengthen communities and unlock new features." },
      { title: "XP & Rewards", body: "Earn XP for actions (searching, joining, donating). Your XP unlocks special rewards and recognition." },
      { title: "Safe & Evolving", body: "We deliver a secure, smooth experience and continuously add features so you control your data and growth." },
    ],
    blocks: {
      mission: { h: "Our Mission", p: "Build the best Clash fan experience with reliable, simple tools — to analyze performance, support clans, and uplift the community." },
      values: { h: "Our Values", items: ["Transparency", "Security", "Community-first", "Continuous improvement"] },
      founder: { h: "About the Founder", p: "Sattam — founder of ClashVIP.io and long-time Clash enthusiast, building the platform iteratively with the community." },
    },
    community: { h: "Join Our Community", p: "Connect with players and clans, share strategies, and grow together inside Clash." },
    support: { h: "Support & Donations", p: "Your support keeps the ecosystem thriving and helps us ship new features for the community." },
    actions: { donate: "Support Now", contact: "Contact Us" },
    legal: {
      line1: "This material is unofficial and is not endorsed by Supercell. For more information, see the",
      author: "Author: Sattam – © 2025 ClashVIP.io All rights reserved",
    },
    images: {
      community: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1200&auto=format&fit=crop",
      support: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?q=80&w=1200&auto=format&fit=crop",
    },
  },
};

