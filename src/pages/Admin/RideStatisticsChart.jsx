import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const mockRideStats = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Completed Rides',
      data: [50, 75, 60, 90, 120, 81, 100],
      borderColor: '#FACC15',
      backgroundColor: 'rgba(250,204,21,0.2)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Cancelled Rides',
      data: [5, 8, 6, 7, 10, 4, 6],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239,68,68,0.1)',
      tension: 0.4,
      fill: true,
    }
  ]
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 20,
      },
    },
  },
};

export default function RideStatisticsChart() {
  return <Line data={mockRideStats} options={options} />;
}
