import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for weekly ride trend
export const weeklyTrendsData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Rides',
      data: [120, 150, 170, 140, 200, 220, 180],
      borderColor: '#FACC15',
      backgroundColor: 'rgba(250,204,21,0.2)',
      tension: 0.4,
      fill: true,
    }
  ]
};

export const weeklyTrendsOptions = {
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
        stepSize: 50,
      },
    },
  },
};

// Mock data for revenue by vehicle type
export const revenuePieData = {
  labels: ['Bike', 'Auto', 'Car'],
  datasets: [
    {
      label: 'Revenue',
      data: [65000, 90000, 129000],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)', // blue for bike
        'rgba(251, 191, 36, 0.7)', // yellow for auto
        'rgba(239, 68, 68, 0.7)'   // red for car
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2,
    }
  ]
};

export const revenuePieOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
    },
  },
};

export function WeeklyRideTrendsChart() {
  return <Line data={weeklyTrendsData} options={weeklyTrendsOptions} />;
}

export function RevenuePieChart() {
  return <Pie data={revenuePieData} options={revenuePieOptions} />;
}
