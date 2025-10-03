

import { useEffect, useState } from "react";

export default function LegalPolicies() {
  const [lang, setLang] = useState("ar"); // "ar" | "en"
  const [tab, setTab] = useState("disclaimer"); // "disclaimer" | "privacy"

  useEffect(() => {
    const pref = (navigator.language || "").toLowerCase();
    if (pref.startsWith("ar")) setLang("ar");
    else if (pref.startsWith("en")) setLang("en");
  }, []);

  const t = translations[lang];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 text-slate-900">
      {/* دوائر خلفية بلورية */}
      <div className="absolute right-[-6rem] bottom-[-12rem] h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute left-[-8rem] top-[-10rem] h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute left-[40%] top-[50%] h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-800">
              {t.title}
            </h1>
            <p className="mt-2 text-sm md:text-base text-blue-700">
              {t.subtitle}
            </p>
            <p className="mt-1 text-xs text-blue-600">{t.lastUpdated}: 3 Oct 2025</p>
          </div>

          {/* Language Toggle */}
          <div className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-sky-500/10 p-1 shadow-md backdrop-blur-md">
            <button
              onClick={() => setLang("ar")}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
                lang === "ar"
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-blue-100"
              }`}
              aria-pressed={lang === "ar"}
            >
              العربية
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${
                lang === "en"
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-blue-100"
              }`}
              aria-pressed={lang === "en"}
            >
              English
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav
          className="mb-6 flex w-full overflow-x-auto rounded-2xl border border-blue-200 bg-sky-500/10 p-1 shadow-md backdrop-blur-md"
          role="tablist"
        >
          <button
            role="tab"
            aria-selected={tab === "disclaimer"}
            className={`flex-1 whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              tab === "disclaimer"
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-100 text-blue-800"
            }`}
            onClick={() => setTab("disclaimer")}
          >
            {t.tabs.disclaimer}
          </button>
          <button
            role="tab"
            aria-selected={tab === "privacy"}
            className={`flex-1 whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              tab === "privacy"
                ? "bg-blue-700 text-white"
                : "hover:bg-blue-100 text-blue-800"
            }`}
            onClick={() => setTab("privacy")}
          >
            {t.tabs.privacy}
          </button>
        </nav>

        {/* Content Cards */}
        <section className="space-y-6">
          {tab === "disclaimer" ? (
            <ArticleCard title={t.disclaimer.title} rtl={lang === "ar"}>
              <ol className="list-decimal ps-5 space-y-3 leading-7 text-slate-800">
                <li>
                  <strong>{t.disclaimer.ip.h}</strong>
                  <p className="mt-2">{t.disclaimer.ip.p1}</p>
                  <p className="mt-1">{t.disclaimer.ip.p2}</p>
                  <p className="mt-1">
                    {t.disclaimer.ip.p3}{" "}
                    <a
                      className="underline text-blue-700 hover:no-underline"
                      href="https://supercell.com/en/fan-content-policy/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Supercell Fan Content Policy
                    </a>
                    .
                  </p>
                </li>
                <li>
                  <strong>{t.disclaimer.liability.h}</strong>
                  <ul className="mt-2 list-disc ps-5 space-y-2">
                    <li>{t.disclaimer.liability.p1}</li>
                    <li>{t.disclaimer.liability.p2}</li>
                    <li>{t.disclaimer.liability.p3}</li>
                  </ul>
                </li>
                <li>
                  <strong>{t.disclaimer.ugc.h}</strong>
                  <p className="mt-2">{t.disclaimer.ugc.p1}</p>
                  <p className="mt-1">{t.disclaimer.ugc.p2}</p>
                </li>
                <li>
                  <strong>{t.disclaimer.law.h}</strong>
                  <p className="mt-2">{t.disclaimer.law.p1}</p>
                  <p className="mt-1">{t.disclaimer.law.p2}</p>
                </li>
                <li>
                  <strong>{t.disclaimer.takedown.h}</strong>
                  <p className="mt-2">{t.disclaimer.takedown.p1}</p>
                </li>
              </ol>
            </ArticleCard>
          ) : (
            <ArticleCard title={t.privacy.title} rtl={lang === "ar"}>
              <div className="space-y-6 text-slate-800">
                {Object.entries(t.privacy).map(([key, section]) =>
                  typeof section === "object" && section.h ? (
                    <Section key={key} title={section.h}>
                      {section.p1 && <p>{section.p1}</p>}
                      {section.p2 && <p>{section.p2}</p>}
                      {section.p3 && <p>{section.p3}</p>}
                      {section.p4 && <p>{section.p4}</p>}
                    </Section>
                  ) : null
                )}
              </div>
            </ArticleCard>
          )}

          {/* Supercell Notice */}
          <div className="rounded-2xl border border-yellow-300 bg-yellow-50/60 p-5 text-yellow-900 shadow-md backdrop-blur-md">
            <p className="text-sm leading-6">
              {t.supercellNote}{" "}
              <a
                className="underline text-blue-700 hover:no-underline"
                href="https://supercell.com/en/fan-content-policy/"
                target="_blank"
                rel="noreferrer"
              >
                Supercell Fan Content Policy
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function ArticleCard({ title, children, rtl = false }) {
  return (
    <article
      dir={rtl ? "rtl" : "ltr"}
      className="rounded-3xl border border-blue-200 bg-sky-500/10 p-6 shadow-md backdrop-blur-md"
    >
      <h2 className="text-2xl font-extrabold tracking-tight text-blue-800">
        {title}
      </h2>
      <div className="mt-4 text-[15px]">{children}</div>
    </article>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="text-lg font-bold text-blue-700">{title}</h3>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}


const translations = {
  ar: {
    title: "الوثائق القانونية — ClashVIP.io",
    subtitle: "هذه الصفحة تتضمن إخلاء المسؤولية وسياسة الخصوصية مُصاغة بما يتوافق مع سياسة محتوى المعجبين لشركة Supercell.",
    lastUpdated: "آخر تحديث",
    tabs: { disclaimer: "إخلاء المسؤولية", privacy: "سياسة الخصوصية" },
    supercellNote:
      "جميع العلامات التجارية والأسماء والشعارات للشركة Supercell Oy وتُستخدم هنا وفق سياسة المحتوى الجماهيري Fan Content. لمزيد من التفاصيل، راجع",

    disclaimer: {
      title: "إخلاء المسؤولية (Disclaimer)",
      ip: {
        h: "علاقة الملكية الفكرية وعدم الانتماء",
        p1: "ClashVIP.io موقع غير رسمي وغير تابع لشركة Supercell Oy ولا تدعمه أو ترعاه بأي شكل.",
        p2: "جميع العلامات التجارية والشعارات والتصاميم والشخصيات الواردة هي ملك حصري لشركة Supercell Oy.",
        p3: "يُستخدم أي محتوى متعلق بـ Supercell وفقًا لـ",
      },
      liability: {
        h: "حدود المسؤولية عن البيانات والخدمات",
        p1: "لا نقدم أي ضمانات صريحة أو ضمنية بشأن دقة أو توفر أو ملاءمة البيانات (بما فيها بيانات واجهة برمجة التطبيقات أو التحليلات).",
        p2: "أي قرارات تُتخذ بناء على المحتوى أو الإحصائيات أو التصنيفات المنشورة تقع على مسؤولية المستخدم بالكامل.",
        p3: "لا يتحمل ClashVIP.io أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة أو تبعية قد تنشأ عن استخدام الموقع أو عدم القدرة على استخدامه.",
      },
      ugc: {
        h: "المحتوى المنشأ من المستخدم وإدارة الإساءة",
        p1: "لا يعبر المحتوى المرسل من المستخدمين (أسماء عشائر، تعليقات، صور، تقارير) بالضرورة عن رأي ClashVIP.io.",
        p2: "نحتفظ بحق تعديل أو إزالة أي محتوى مخالف أو مسيء أو منتهِك للحقوق وفق تقديرنا وامتثالاً للقوانين واللوائح ذات الصلة.",
      },
      law: {
        h: "القانون الواجب التطبيق والاختصاص القضائي",
        p1: "تخضع هذه الصفحة وشروط استخدامها لقوانين المملكة العربية السعودية، مع عدم الإخلال بأي قواعد آمرة في نطاق حماية المستهلك والبيانات الشخصية.",
        p2: "يُنعقد الاختصاص القضائي للمحاكم المختصة في مدينة الرياض ما لم يتفق على غير ذلك بموجب القانون.",
      },
      takedown: {
        h: "إشعارات الإزالة والتعديلات",
        p1: "نلتزم بالتعاون مع Supercell مالكة الحقوق ومع أصحاب الحقوق الآخرين بشأن أي طلبات إزالة أو تعديلات على المحتوى لضمان الامتثال الكامل.",
      },
    },

    privacy: {
      title: "سياسة الخصوصية (Privacy Policy)",
      collect: {
        h: "المعلومات التي نجمعها",
        p1: "بيانات الدخول: البريد الإلكتروني أو معرف الحساب عند تسجيل الدخول عبر Google/Apple/Discord/Facebook (نجمع الحد الأدنى اللازم).",
        p2: "بيانات اللعبة: بيانات عامة من واجهة برمجة تطبيقات Clash of Clans مثل المستوى والتبرعات وسجل تغيير الاسم والتحقق من رمز اللاعب.",
        p3: "بيانات الاستخدام: معرّفات الجهاز التقريبية وملفات تعريف الارتباط وبيانات التحليلات لتحسين الأداء والتخصيص.",
        p4: "بيانات الدعم: المراسلات مع فريق الدعم، وتقارير الأعطال وسجلات الأمان ذات الصلة بمنع إساءة الاستخدام.",
      },
      use: {
        h: "كيفية استخدام البيانات",
        p1: "تقديم الميزات الأساسية (إحصائيات، تتبع التبرعات، لوحات الترتيب، التحقق من ملكية الحساب).",
        p2: "تحسين الأداء وتجربة المستخدم وإتاحة الدعم الفني.",
        p3: "تطبيق ضوابط الأمان والكشف عن الاحتيال وإساءة الاستخدام والامتثال القانوني.",
        p4: "إجراء التحليلات المجمّعة غير المحدِّدة للهوية لإحصاءات المجتمع.",
      },
      legal: {
        h: "الأسس النظامية للمعالجة",
        p1: "تنفيذ العقد: تشغيل حسابك والخدمات المرتبطة به.",
        p2: "المصلحة المشروعة: منع الاحتيال وتحسين الخدمات وقياس الاستخدام.",
        p3: "الموافقة: حيثما لزم الأمر (مثل ملفات تعريف الارتباط الاختيارية ورسائل التسويق إن وُجدت).",
      },
      share: {
        h: "مشاركة البيانات مع أطراف ثالثة",
        p1: "لا نبيع بياناتك ولا نشاركها لأغراض إعلانية بدون موافقتك الصريحة.",
        p2: "قد نستخدم مزوّدي خدمات تقنيين (الاستضافة، القياس، مكافحة الاحتيال) وفق اتفاقيات معالجة بيانات مناسبة وقيود وصول صارمة.",
        p3: "قد نشارك بياناتًا مجمّعة/مجهولة لأغراض إحصائية لا تُعرّف بشخصك.",
      },
      security: {
        h: "الأمان",
        p1: "نستخدم HTTPS وتجزئة كلمات المرور بـ bcrypt وتوثيق JWT وتجزئة صلاحيات (RBAC).",
        p2: "تطبق سياسات أقل امتياز والوصول المراقب وسجلات تدقيق على العمليات الحساسة.",
        p3: "بالرغم من جهودنا، لا توجد وسيلة نقل/تخزين إلكترونية آمنة 100% ونشجع اتباع ممارسات أمان قوية من جانبك.",
      },
      retention: { h: "الاحتفاظ بالبيانات", p1: "نحتفظ بالبيانات للمدة اللازمة لتقديم الخدمات والامتثال للمتطلبات القانونية، ثم نحذفها أو نجردها من الهوية بشكل آمن." },
      kids: { h: "الأطفال", p1: "لا تستهدف خدماتنا الأطفال دون 13 عامًا، ولا نجمع عن قصد بيانات شخصية منهم. إذا كنت تعتقد خلاف ذلك فاتصل بنا لحذفها." },
      rights: {
        h: "حقوقك",
        p1: "الوصول: يمكنك طلب نسخة من بياناتك الشخصية التي نعالجها.",
        p2: "التصحيح والحذف: يمكنك تصحيح بياناتك أو طلب حذفها وإلغاء ربط حساب اللعبة في أي وقت.",
        p3: "الاعتراض والانسحاب: يمكنك الاعتراض على بعض المعالجات أو سحب موافقتك حيثما كان الأساس القانوني هو الموافقة.",
        p4: "قابلية النقل: سنزوّدك ببياناتك بتنسيق قابل للنقل حيثما كان ذلك واجب التطبيق.",
      },
      transfers: { h: "النقل الدولي", p1: "قد تُنقل البيانات وتُخزن خارج بلدك لدى مزودين موثوقين. نتخذ ضمانات مناسبة (مثل بنود تعاقدية قياسية) حيثما لزم." },
      cookies: { h: "ملفات تعريف الارتباط (Cookies)", p1: "نستخدم ملفات أساسية لتشغيل الموقع، وقد نستخدم ملفات اختيارية للتحليلات/التخصيص بموافقتك. يمكنك إدارة التفضيلات من إعدادات المتصفح أو لافتة الموافقة." },
      changes: { h: "تغييرات السياسة", p1: "قد نحدّث هذه السياسة من وقت لآخر. سيُشار إلى تاريخ أحدث إصدار، وتصبح التعديلات نافذة عند نشرها." },
      contact: { h: "التواصل", p1: "للاستفسار أو ممارسة حقوقك: support@clashvip.io" },
    },
  },

  en: {
    title: "Legal Documents — ClashVIP.io",
    subtitle:
      "This page includes our Disclaimer and Privacy Policy, drafted to comply with Supercell's Fan Content Policy.",
    lastUpdated: "Last updated",
    tabs: { disclaimer: "Disclaimer", privacy: "Privacy Policy" },
    supercellNote:
      "All trademarks, names and logos are the property of Supercell Oy and are used here under the Fan Content Policy. For details, see",

    disclaimer: {
      title: "Disclaimer",
      ip: {
        h: "Intellectual Property & Non‑Affiliation",
        p1: "ClashVIP.io is an unofficial fan website. It is not affiliated with, endorsed by, or sponsored by Supercell Oy.",
        p2: "All trademarks, logos, designs, and characters referenced are the exclusive property of Supercell Oy.",
        p3: "Any Supercell‑related content is used in accordance with the",
      },
      liability: {
        h: "Limitation of Liability for Data & Services",
        p1: "We make no express or implied warranties as to the accuracy, availability, or fitness of data (including API data or analytics).",
        p2: "Decisions made on the basis of content, statistics, or rankings published on the site are at the user's sole risk.",
        p3: "ClashVIP.io shall not be liable for any direct, indirect, or consequential damages arising from use of or inability to use the site.",
      },
      ugc: {
        h: "User‑Generated Content & Abuse Moderation",
        p1: "User‑submitted content (clan names, comments, images, reports) does not necessarily reflect the views of ClashVIP.io.",
        p2: "We reserve the right to edit or remove content that is unlawful, abusive, or infringing, in line with applicable laws and policies.",
      },
      law: {
        h: "Governing Law & Jurisdiction",
        p1: "These terms and their use are governed by the laws of the Kingdom of Saudi Arabia, without prejudice to mandatory consumer/data rules.",
        p2: "Courts in Riyadh, KSA, shall have jurisdiction, unless otherwise required by applicable law.",
      },
      takedown: {
        h: "Takedown & Adjustments",
        p1: "We cooperate with Supercell (as rights holder) and other rights owners on any takedown or adjustment requests to ensure full compliance.",
      },
    },

    privacy: {
      title: "Privacy Policy",
      collect: {
        h: "Information We Collect",
        p1: "Login Data: email or account ID when you sign in with Google/Apple/Discord/Facebook (we collect the minimum necessary).",
        p2: "Game Data: public Clash of Clans API data such as level, donations, name‑change history, and player token verification.",
        p3: "Usage Data: device identifiers (approximate), cookies, and analytics signals for performance and personalization.",
        p4: "Support Data: correspondence with support, crash reports, and relevant security logs to prevent abuse.",
      },
      use: {
        h: "How We Use Data",
        p1: "To provide core features (stats, donation tracking, leaderboards, account ownership verification).",
        p2: "To improve performance, user experience, and support operations.",
        p3: "To enforce security controls, detect fraud/abuse, and meet legal obligations.",
        p4: "To conduct aggregated, de‑identified analytics for community insights.",
      },
      legal: {
        h: "Legal Bases",
        p1: "Contract: operating your account and delivering the services.",
        p2: "Legitimate Interests: preventing fraud, improving services, and measuring usage.",
        p3: "Consent: where required (e.g., optional cookies and any marketing communications).",
      },
      share: {
        h: "Data Sharing with Third Parties",
        p1: "We do not sell your data or share it for advertising without your explicit consent.",
        p2: "We may use technical providers (hosting, measurement, anti‑fraud) under appropriate data‑processing agreements and strict access limits.",
        p3: "We may share aggregated/de‑identified data for statistics that cannot identify you.",
      },
      security: {
        h: "Security",
        p1: "We use HTTPS, bcrypt password hashing, JWT auth, and role‑based access controls (RBAC).",
        p2: "We apply least‑privilege access, monitoring, and audit logging on sensitive operations.",
        p3: "While we strive for strong security, no electronic transmission/storage is 100% secure, so we encourage your own security best practices.",
      },
      retention: { h: "Data Retention", p1: "We retain data for as long as necessary to deliver services and meet legal requirements, then delete or safely de‑identify it." },
      kids: { h: "Children", p1: "Our services are not directed to children under 13, and we do not knowingly collect their personal data. Contact us for deletion if you believe otherwise." },
      rights: {
        h: "Your Rights",
        p1: "Access: request a copy of your personal data.",
        p2: "Rectification & Deletion: correct your data or request erasure; unlink your game account anytime.",
        p3: "Objection & Withdrawal: object to certain processing or withdraw consent where consent is the legal basis.",
        p4: "Portability: receive your data in a portable format where applicable.",
      },
      transfers: { h: "International Transfers", p1: "Your data may be transferred/stored outside your country with trusted providers. We implement appropriate safeguards (e.g., standard contractual clauses) where required." },
      cookies: { h: "Cookies", p1: "We use essential cookies for site operation and, with your consent, optional cookies for analytics/personalization. Manage preferences via your browser or the consent banner." },
      changes: { h: "Changes to This Policy", p1: "We may update this policy from time to time. The latest date will be indicated, and changes take effect upon posting." },
      contact: { h: "Contact Us", p1: "For inquiries or to exercise your rights: support@clashvip.io" },
    },
  },
};
