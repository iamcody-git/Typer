import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay = ({ correctCount, errorCount }) => {
  const chartData = {
    labels: ["Correct Words", "Incorrect Words"],
    datasets: [
      {
        label: "Typing Results",
        data: [correctCount, errorCount],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#4caf50", "#f44336"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      title: { display: true, text: "Typing Test Results", color:'yellow' },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", 
        width: "100vw", 
      }}
    >
      <div style={{ width: "500px", height: "400px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ChartDisplay;