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

// Accepts data and options as props, or shows a placeholder if not provided
export default function RideStatisticsChart({ data, options }) {
  if (!data) {
    return <div style={{textAlign:'center',padding:'2rem',color:'#888'}}>No ride statistics data available.</div>;
  }
  return <Line data={data} options={options} />;
}
