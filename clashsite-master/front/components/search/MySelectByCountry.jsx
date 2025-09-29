import Select from "react-select";
import { useEffect, useState } from "react";
import "./scroll.css";
import { Link } from "react-router-dom";

const options = [
  { value: 32000008, label: "A...land Islands" },
  { value: 32000009, label: "Albania" },
  { value: 32000010, label: "Algeria" },
  { value: 32000011, label: "American Samoa" },
  { value: 32000012, label: "Andorra" },
  { value: 32000013, label: "Angola" },
  { value: 32000014, label: "Anguilla" },
  { value: 32000015, label: "Antarctica" },
  { value: 32000016, label: "Antigua and Barbuda" },
  { value: 32000017, label: "Argentina" },
  { value: 32000018, label: "Armenia" },
  { value: 32000019, label: "Aruba" },
  { value: 32000020, label: "Ascension Island" },
  { value: 32000021, label: "Australia" },
  { value: 32000022, label: "Austria" },
  { value: 32000023, label: "Azerbaijan" },
  { value: 32000024, label: "Bahamas" },
  { value: 32000025, label: "Bahrain" },
  { value: 32000026, label: "Bangladesh" },
  { value: 32000027, label: "Barbados" },
  { value: 32000028, label: "Belarus" },
  { value: 32000029, label: "Belgium" },
  { value: 32000030, label: "Belize" },
  { value: 32000031, label: "Benin" },
  { value: 32000032, label: "Bermuda" },
  { value: 32000033, label: "Bhutan" },
  { value: 32000034, label: "Bolivia" },
  { value: 32000035, label: "Bosnia and Herzegovina" },
  { value: 32000036, label: "Botswana" },
  { value: 32000037, label: "Bouvet Island" },
  { value: 32000038, label: "Brazil" },
  { value: 32000039, label: "British Indian Ocean Territory" },
  { value: 32000040, label: "British Virgin Islands" },
  { value: 32000041, label: "Brunei" },
  { value: 32000042, label: "Bulgaria" },
  { value: 32000043, label: "Burkina Faso" },
  { value: 32000044, label: "Burundi" },
  { value: 32000045, label: "Cambodia" },
  { value: 32000046, label: "Cameroon" },
  { value: 32000047, label: "Canada" },
  { value: 32000048, label: "Canary Islands" },
  { value: 32000049, label: "Cape Verde" },
  { value: 32000050, label: "Caribbean Netherlands" },
  { value: 32000051, label: "Cayman Islands" },
  { value: 32000052, label: "Central African Republic" },
  { value: 32000053, label: "Ceuta and Melilla" },
  { value: 32000054, label: "Chad" },
  { value: 32000055, label: "Chile" },
  { value: 32000056, label: "China" },
  { value: 32000057, label: "Christmas Island" },
  { value: 32000058, label: "Cocos (Keeling) Islands" },
  { value: 32000059, label: "Colombia" },
  { value: 32000060, label: "Comoros" },
  { value: 32000061, label: "Congo (DRC)" },
  { value: 32000062, label: "Congo (Republic)" },
  { value: 32000063, label: "Cook Islands" },
  { value: 32000064, label: "Costa Rica" },
  { value: 32000065, label: "CA te daTMIvoire" },
  { value: 32000066, label: "Croatia" },
  { value: 32000067, label: "Cuba" },
  { value: 32000068, label: "CuraAao" },
  { value: 32000069, label: "Cyprus" },
  { value: 32000070, label: "Czech Republic" },
  { value: 32000071, label: "Denmark" },
  { value: 32000072, label: "Diego Garcia" },
  { value: 32000073, label: "Djibouti" },
  { value: 32000074, label: "Dominica" },
  { value: 32000075, label: "Dominican Republic" },
  { value: 32000076, label: "Ecuador" },
  { value: 32000077, label: "Egypt" },
  { value: 32000078, label: "El Salvador" },
  { value: 32000079, label: "Equatorial Guinea" },
  { value: 32000080, label: "Eritrea" },
  { value: 32000081, label: "Estonia" },
  { value: 32000082, label: "Ethiopia" },
  { value: 32000083, label: "Falkland Islands" },
  { value: 32000084, label: "Faroe Islands" },
  { value: 32000085, label: "Fiji" },
  { value: 32000086, label: "Finland" },
  { value: 32000087, label: "France" },
  { value: 32000088, label: "French Guiana" },
  { value: 32000089, label: "French Polynesia" },
  { value: 32000090, label: "French Southern Territories" },
  { value: 32000091, label: "Gabon" },
  { value: 32000092, label: "Gambia" },
  { value: 32000093, label: "Georgia" },
  { value: 32000094, label: "Germany" },
  { value: 32000095, label: "Ghana" },
  { value: 32000096, label: "Gibraltar" },
  { value: 32000097, label: "Greece" },
  { value: 32000098, label: "Greenland" },
  { value: 32000099, label: "Grenada" },
  { value: 32000100, label: "Guadeloupe" },

  { value: 32000101, label: "Guam" },
  { value: 32000102, label: "Guatemala" },
  { value: 32000103, label: "Guernsey" },
  { value: 32000104, label: "Guinea" },
  { value: 32000105, label: "Guinea-Bissau" },
  { value: 32000106, label: "Guyana" },
  { value: 32000107, label: "Haiti" },
  { value: 32000108, label: "Heard & McDonald Islands" },
  { value: 32000109, label: "Honduras" },
  { value: 32000110, label: "Hong Kong" },
  { value: 32000111, label: "Hungary" },
  { value: 32000112, label: "Iceland" },
  { value: 32000113, label: "India" },
  { value: 32000114, label: "Indonesia" },
  { value: 32000115, label: "Iran" },
  { value: 32000116, label: "Iraq" },
  { value: 32000117, label: "Ireland" },
  { value: 32000118, label: "Isle of Man" },
  { value: 32000119, label: "Israel" },
  { value: 32000120, label: "Italy" },
  { value: 32000121, label: "Jamaica" },
  { value: 32000122, label: "Japan" },
  { value: 32000123, label: "Jersey" },
  { value: 32000124, label: "Jordan" },
  { value: 32000125, label: "Kazakhstan" },
  { value: 32000126, label: "Kenya" },
  { value: 32000127, label: "Kiribati" },
  { value: 32000128, label: "Kosovo" },
  { value: 32000129, label: "Kuwait" },
  { value: 32000130, label: "Kyrgyzstan" },
  { value: 32000131, label: "Laos" },
  { value: 32000132, label: "Latvia" },
  { value: 32000133, label: "Lebanon" },
  { value: 32000134, label: "Lesotho" },
  { value: 32000135, label: "Liberia" },
  { value: 32000136, label: "Libya" },
  { value: 32000137, label: "Liechtenstein" },
  { value: 32000138, label: "Lithuania" },
  { value: 32000139, label: "Luxembourg" },
  { value: 32000140, label: "Macau" },
  { value: 32000141, label: "North Macedonia" },
  { value: 32000142, label: "Madagascar" },
  { value: 32000143, label: "Malawi" },
  { value: 32000144, label: "Malaysia" },
  { value: 32000145, label: "Maldives" },
  { value: 32000146, label: "Mali" },
  { value: 32000147, label: "Malta" },
  { value: 32000148, label: "Marshall Islands" },
  { value: 32000149, label: "Martinique" },
  { value: 32000150, label: "Mauritania" },
  { value: 32000151, label: "Mauritius" },
  { value: 32000152, label: "Mayotte" },
  { value: 32000153, label: "Mexico" },
  { value: 32000154, label: "Micronesia" },
  { value: 32000155, label: "Moldova" },
  { value: 32000156, label: "Monaco" },
  { value: 32000157, label: "Mongolia" },
  { value: 32000158, label: "Montenegro" },
  { value: 32000159, label: "Montserrat" },
  { value: 32000160, label: "Morocco" },
  { value: 32000161, label: "Mozambique" },
  { value: 32000162, label: "Myanmar (Burma)" },
  { value: 32000163, label: "Namibia" },
  { value: 32000164, label: "Nauru" },
  { value: 32000165, label: "Nepal" },
  { value: 32000166, label: "Netherlands" },
  { value: 32000167, label: "New Caledonia" },
  { value: 32000168, label: "New Zealand" },
  { value: 32000169, label: "Nicaragua" },
  { value: 32000170, label: "Niger" },
  { value: 32000171, label: "Nigeria" },
  { value: 32000172, label: "Niue" },
  { value: 32000173, label: "Norfolk Island" },
  { value: 32000174, label: "North Korea" },
  { value: 32000175, label: "Northern Mariana Islands" },
  { value: 32000176, label: "Norway" },
  { value: 32000177, label: "Oman" },
  { value: 32000178, label: "Pakistan" },
  { value: 32000179, label: "Palau" },
  { value: 32000180, label: "Palestine" },
  { value: 32000181, label: "Panama" },
  { value: 32000182, label: "Papua New Guinea" },
  { value: 32000183, label: "Paraguay" },
  { value: 32000184, label: "Peru" },
  { value: 32000185, label: "Philippines" },
  { value: 32000186, label: "Pitcairn Islands" },
  { value: 32000187, label: "Poland" },
  { value: 32000188, label: "Portugal" },
  { value: 32000189, label: "Puerto Rico" },
  { value: 32000190, label: "Qatar" },
  { value: 32000191, label: "RAunion" },
  { value: 32000192, label: "Romania" },
  { value: 32000193, label: "Russia" },
  { value: 32000194, label: "Rwanda" },
  { value: 32000195, label: "Saint BarthAlemy" },
  { value: 32000196, label: "Saint Helena" },
  { value: 32000197, label: "Saint Kitts and Nevis" },
  { value: 32000198, label: "Saint Lucia" },
  { value: 32000199, label: "Saint Martin" },
  { value: 32000200, label: "Saint Pierre and Miquelon" },
  { value: 32000201, label: "Samoa" },
  { value: 32000202, label: "San Marino" },
  { value: 32000203, label: "SAo TomA and PrAncipe" },
  { value: 32000204, label: "Saudi Arabia" },
  { value: 32000205, label: "Senegal" },
  { value: 32000206, label: "Serbia" },
  { value: 32000207, label: "Seychelles" },
  { value: 32000208, label: "Sierra Leone" },
  { value: 32000209, label: "Singapore" },
  { value: 32000210, label: "Sint Maarten" },
  { value: 32000211, label: "Slovakia" },
  { value: 32000212, label: "Slovenia" },
  { value: 32000213, label: "Solomon Islands" },
  { value: 32000214, label: "Somalia" },
  { value: 32000215, label: "South Africa" },
  { value: 32000216, label: "South Korea" },
  { value: 32000217, label: "South Sudan" },
  { value: 32000218, label: "Spain" },
  { value: 32000219, label: "Sri Lanka" },
  { value: 32000220, label: "St. Vincent & Grenadines" },
  { value: 32000221, label: "Sudan" },
  { value: 32000222, label: "Suriname" },
  { value: 32000223, label: "Svalbard and Jan Mayen" },
  { value: 32000224, label: "Swaziland" },
  { value: 32000225, label: "Sweden" },
  { value: 32000226, label: "Switzerland" },
  { value: 32000227, label: "Syria" },
  { value: 32000228, label: "Taiwan" },
  { value: 32000229, label: "Tajikistan" },
  { value: 32000230, label: "Tanzania" },
  { value: 32000231, label: "Thailand" },
  { value: 32000232, label: "Timor-Leste" },
  { value: 32000233, label: "Togo" },
  { value: 32000234, label: "Tokelau" },
  { value: 32000235, label: "Tonga" },
  { value: 32000236, label: "Trinvaluead and Tobago" },
  { value: 32000237, label: "Tristan da Cunha" },
  { value: 32000238, label: "Tunisia" },
  { value: 32000239, label: "TA14rkiye" },
  { value: 32000240, label: "Turkmenistan" },
  { value: 32000241, label: "Turks and Caicos Islands" },
  { value: 32000242, label: "Tuvalu" },
  { value: 32000243, label: "U.S. Outlying Islands" },
  { value: 32000244, label: "U.S. Virgin Islands" },
  { value: 32000245, label: "Uganda" },
  { value: 32000246, label: "Ukraine" },
  { value: 32000247, label: "United Arab Emirates" },
  { value: 32000248, label: "United Kingdom" },
  { value: 32000249, label: "United States" },
  { value: 32000250, label: "Uruguay" },
  { value: 32000251, label: "Uzbekistan" },
  { value: 32000252, label: "Vanuatu" },
  { value: 32000253, label: "Vatican City" },
  { value: 32000254, label: "Venezuela" },
  { value: 32000255, label: "Vietnam" },
  { value: 32000256, label: "Wallis and Futuna" },
  { value: 32000257, label: "Western Sahara" },
  { value: 32000258, label: "Yemen" },
  { value: 32000259, label: "Zambia" },
  { value: 32000260, label: "Zimbabwe" },
];


export default function MySelectByCountry() {
  const [clans, setClans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedValue, setSelectedValue] = useState(32000008);

  const handleChange = (option) => {
    if (!option) return;
    setSelectedValue(option.value);
  };

  useEffect(() => {
    const getClans = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          ` ${import.meta.env.VITE_API_URL}/clansoflocation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ locationID: selectedValue }),
          }
        );
        const mydata = await res.json();

        const clansData = Array.isArray(mydata.clans) ? mydata.clans : [];
        setClans(clansData);
      } catch (err) {
        console.error("Error fetching clans:", err);
        setClans([]);
        setError("حدث خطأ في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    getClans();
  }, [selectedValue]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white max-w-4xl mx-auto h-[500px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
        choose country & clans
      </h2>

      <Select
        className="mb-6 text-black"
        placeholder="choose country"
        options={options}
        onChange={handleChange}
        value={options.find((option) => option.value === selectedValue)}
      />

      <ul className="space-y-4">
        {clans.map((clan, index) => {
          const rawTag = typeof clan.tag === "string" ? clan.tag : "";
          const clanTag = rawTag.replace(/#/g, "");
          const linkTarget = clanTag ? `/clan/${clanTag}` : null;
          const key = rawTag || `clan-${index}`;

          return (
            <li
              key={key}
              className="bg-slate-800/80 rounded-3xl p-4 flex items-center gap-4 shadow-lg hover:scale-[1.02] transition"
            >
              {linkTarget ? (
                <Link to={linkTarget}>
                  <img
                    src={clan.badge?.url}
                    alt={clan.name || "clan badge"}
                    className="w-16 h-16 rounded-full border-4 border-yellow-400 shadow-md hover:scale-105 transition"
                  />
                </Link>
              ) : (
                <img
                  src={clan.badge?.url}
                  alt={clan.name || "clan badge"}
                  className="w-16 h-16 rounded-full border-4 border-yellow-400 shadow-md"
                />
              )}

              <div className="flex-1">
                {linkTarget ? (
                  <Link to={linkTarget}>
                    <p className="text-xl font-bold">{clan.name || "-"}</p>
                    <p className="text-sm text-gray-300">{rawTag}</p>
                  </Link>
                ) : (
                  <>
                    <p className="text-xl font-bold">{clan.name || "-"}</p>
                    <p className="text-sm text-gray-300">{rawTag}</p>
                  </>
                )}
              </div>

              <div className="flex gap-6 text-sm text-center">
                <div>
                  <p className="text-yellow-400 font-semibold">order</p>
                  <p className="text-gray-200">{clan.rank ?? "-"}</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-semibold">level</p>
                  <p className="text-gray-200">{clan.level ?? "-"}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
