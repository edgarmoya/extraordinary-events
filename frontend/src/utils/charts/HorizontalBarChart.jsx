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

const HorizontalBarChart = ({ typesData }) => {
  const data = {
    labels: typesData.map((data) => data.type_description),
    datasets: [
      {
        label: "Cantidad",
        data: typesData.map((data) => data.events_count),
        backgroundColor: "rgb(13, 110, 253)",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    layout: {
      padding: 20,
    },
    plugins: {
      title: {
        text: "Resumen de tipos",
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="w-100 px-2">
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalBarChart;
