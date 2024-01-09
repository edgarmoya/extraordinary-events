import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ percentageBySector }) => {
  const data = {
    labels: percentageBySector.map((data) => data.sector_name),
    datasets: [
      {
        label: "Porcentaje",
        data: percentageBySector.map((data) => data.percentage_in_sector),
        backgroundColor: [
          "rgb(5, 42, 99)",
          "rgb(49, 131, 252)",
          "rgb(9, 76, 176)",
          "rgb(49, 131, 252)",
          "rgb(93, 110, 143)",
        ],
      },
    ],
  };

  const options = {
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
    <div className="px-3">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
