import PropTypes from "prop-types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "#cbd5f5",
        font: { size: 11 },
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#93a5c6",
        font: { size: 11 },
      },
      grid: {
        color: "rgba(148, 163, 184, 0.1)",
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#93a5c6",
        font: { size: 11 },
      },
      grid: {
        color: "rgba(148, 163, 184, 0.08)",
      },
    },
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
};

const palette = {
  legend: "#facc15",
  builder: "#38bdf8",
};

export default function SeasonTrophiesChart({ points, className = "" }) {
  const labels = points.map((point) => point.label);

  const legendDataset = points.map((point) =>
    typeof point.legend === "number" ? point.legend : null,
  );
  const builderDataset = points.map((point) =>
    typeof point.builder === "number" ? point.builder : null,
  );

  const datasets = [];

  if (legendDataset.some((value) => value !== null)) {
    datasets.push({
      label: "Legend League",
      data: legendDataset,
      borderColor: palette.legend,
      backgroundColor: "rgba(250, 204, 21, 0.25)",
      fill: true,
      tension: 0.35,
      spanGaps: true,
    });
  }

  if (builderDataset.some((value) => value !== null)) {
    datasets.push({
      label: "Builder Versus",
      data: builderDataset,
      borderColor: palette.builder,
      backgroundColor: "rgba(56, 189, 248, 0.2)",
      fill: true,
      tension: 0.35,
      spanGaps: true,
    });
  }

  if (!datasets.length) {
    return (
      <section
        className={`flex min-h-[240px] flex-col justify-center gap-2 rounded-3xl bg-slate-950/70 p-6 text-center text-sm text-slate-300 shadow-xl ring-1 ring-slate-700/40 ${className}`}
      >
        <h3 className="text-lg font-semibold text-white">Season Trophy Trend</h3>
        <p>Not enough seasonal data to chart yet.</p>
      </section>
    );
  }

  const data = {
    labels,
    datasets,
  };

  return (
    <section
      className={`rounded-3xl bg-slate-950/70 p-6 shadow-xl ring-1 ring-slate-700/40 ${className}`}
      aria-label="Season trophy trend"
    >
      <header className="mb-4 space-y-1 text-center sm:text-left">
        <h3 className="text-xl font-semibold text-white">Legend League Season Trophy Trend</h3>
        <p className="text-sm text-slate-300">Track recent legend and builder trophy swings at a glance.</p>
      </header>
      <div className="h-48 sm:h-60 lg:h-72">
        <Line data={data} options={baseOptions} />
      </div>
    </section>
  );
}

SeasonTrophiesChart.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      legend: PropTypes.number,
      builder: PropTypes.number,
    }),
  ).isRequired,
  className: PropTypes.string,
};
