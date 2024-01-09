import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const StackedBarChart = ({ scopes }) => {
  const data = {
    labels: scopes.map((data) => data.province_name),
    datasets: [
      {
        label: "Relevante",
        data: scopes.map((data) => data.relevant_events_count),
        backgroundColor: "rgb(5, 42, 99)",
      },
      {
        label: "Corrupción",
        data: scopes.map((data) => data.corruption_events_count),
        backgroundColor: "rgb(49, 131, 252)",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
    layout: {
      padding: 20,
    },
    plugins: {
      title: {
        text: "Resumen de sectores",
      },
    },
  };

  return (
    <div className="w-100 px-2">
      <Bar data={data} options={options} />
    </div>
  );
};

export default StackedBarChart;
