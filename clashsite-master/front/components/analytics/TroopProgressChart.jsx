import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const options = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.x}% progress`,
      },
    },
  },
  scales: {
    x: {
      min: 0,
      max: 100,
      ticks: {
        color: "#93a5c6",
        stepSize: 20,
      },
      grid: {
        color: "rgba(148, 163, 184, 0.08)",
      },
    },
    y: {
      ticks: {
        color: "#cbd5f5",
        font: { size: 11 },
      },
      grid: {
        display: false,
      },
    },
  },
};

export default function TroopProgressChart({ data, className = "h-64" }) {
  if (!data.length) {
    return (
      <div
        className={`flex h-64 items-center justify-center rounded-3xl bg-slate-950/70 text-sm text-slate-300 shadow-xl ring-1 ring-slate-700/40 ${className}`}
      >
        Troop upgrade information is unavailable for this player.
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Upgrade Progress",
        data: data.map((item) => item.percent),
        backgroundColor: data.map((item, index) =>
          index < 3 ? "rgba(14, 165, 233, 0.8)" : "rgba(56, 189, 248, 0.55)",
        ),
        borderRadius: 12,
        barThickness: 18,
      },
    ],
  };

  return (
    <div
      className={`rounded-3xl bg-slate-950/70 p-6 shadow-xl ring-1 ring-slate-700/40 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">Troop Upgrade Progress</h3>
        <p className="text-sm text-slate-300">
          Top troop upgrades by completion percentage — a quick glance at where
          to focus next.
        </p>
      </div>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

TroopProgressChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      percent: PropTypes.number.isRequired,
    }),
  ).isRequired,
  className: PropTypes.string,
};
