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
          "#76e376",
          "rgb(48, 146, 48)",
          "rgb(89, 201, 89)",
          "rgb(76, 155, 76)",
          "rgb(50, 124, 50)",
          "rgb(36, 107, 36)",
          "rgb(47, 155, 47)",
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
      legend: {
        display: false,
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
