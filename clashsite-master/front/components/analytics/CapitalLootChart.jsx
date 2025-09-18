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

const options = {
  responsive: true,
  maintainAspectRatio: false,
  stacked: false,
  interaction: {
    intersect: false,
    mode: "index",
  },
  plugins: {
    legend: {
      labels: {
        color: "#cbd5f5",
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return `${context.dataset.label}: ${value.toLocaleString()}`;
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#93a5c6",
      },
      grid: { color: "rgba(148, 163, 184, 0.08)" },
    },
    y: {
      ticks: {
        color: "#93a5c6",
      },
      grid: { color: "rgba(148, 163, 184, 0.08)" },
    },
  },
};

export default function CapitalLootChart({ points, className = "h-64" }) {
  if (!points.length) {
    return (
      <div
        className={`flex h-64 items-center justify-center rounded-3xl bg-slate-950/70 text-sm text-slate-300 shadow-xl ring-1 ring-slate-700/40 ${className}`}
      >
        Capital raid history is not available yet.
      </div>
    );
  }

  const labels = points.map((point) => point.label);

  const data = {
    labels,
    datasets: [
      {
        label: "Capital Loot",
        data: points.map((point) => point.capitalLoot),
        borderColor: "#38bdf8",
        backgroundColor: "rgba(14, 165, 233, 0.25)",
        tension: 0.35,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Raids Completed",
        data: points.map((point) => point.raidsCompleted ?? null),
        borderColor: "#fde68a",
        backgroundColor: "rgba(250, 204, 21, 0.25)",
        tension: 0.35,
        fill: false,
        spanGaps: true,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    ...options,
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        title: {
          display: true,
          text: "Loot",
          color: "#93a5c6",
        },
      },
      y1: {
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#cbd5f5",
        },
        title: {
          display: true,
          text: "Raids",
          color: "#cbd5f5",
        },
      },
    },
  };

  return (
    <div
      className={`rounded-3xl bg-slate-950/70 p-6 shadow-xl ring-1 ring-slate-700/40 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white">Capital Loot Trend</h3>
        <p className="text-sm text-slate-300">
          Season-over-season capital performance, similar to Clash of Stats raid
          dashboards.
        </p>
      </div>
      <div className="h-64">
        <Line data={data} options={chartOptions} />
      </div>
    </div>
  );
}

CapitalLootChart.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      capitalLoot: PropTypes.number.isRequired,
      raidsCompleted: PropTypes.number,
    }),
  ).isRequired,
  className: PropTypes.string,
};
