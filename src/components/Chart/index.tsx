'use client';

import { AnalyticsData, ChartProps } from '@/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Chart({ data, type, height = 300 }: ChartProps) {
  // Preparar dados para gráfico de barras agrupadas
  const barData = data.map((day: AnalyticsData) => ({
    date: day.date,
    'Usuários Ativos': day.activeUsers,
    'Sessões': day.sessions,
    'Visualizações': day.pageViews,
    'Sessões Engajadas': day.engagedSessions,
  }));

  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart 
          data={data} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            fontSize={12} 
          />
          <YAxis 
            stroke="#666" 
            fontSize={12} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="activeUsers" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }} 
            name="Usuários Ativos" 
          />
          <Line 
            type="monotone" 
            dataKey="sessions" 
            stroke="#8b5cf6" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            name="Sessões" 
          />
          <Line 
            type="monotone" 
            dataKey="pageViews" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            name="Visualizações" 
          />
          <Line 
            type="monotone" 
            dataKey="engagedSessions" 
            stroke="#f59e0b" 
            strokeWidth={2} 
            dot={{ r: 4 }} 
            name="Sessões Engajadas" 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={barData} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            fontSize={12} 
          />
          <YAxis 
            stroke="#666" 
            fontSize={12} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="Usuários Ativos" 
            fill="#3b82f6" 
            radius={[2, 2, 0, 0]} 
          />
          <Bar 
            dataKey="Sessões" 
            fill="#8b5cf6" 
            radius={[2, 2, 0, 0]} 
          />
          <Bar 
            dataKey="Visualizações" 
            fill="#10b981" 
            radius={[2, 2, 0, 0]} 
          />
          <Bar 
            dataKey="Sessões Engajadas" 
            fill="#f59e0b" 
            radius={[2, 2, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
}