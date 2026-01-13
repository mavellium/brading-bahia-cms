'use client';

import { MetricCardProps } from "@/types";


export default function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  color, 
  avg 
}: MetricCardProps) {
  
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', light: 'bg-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', light: 'bg-purple-100' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', light: 'bg-green-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', light: 'bg-orange-100' },
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', light: 'bg-red-100' },
  };

  const trendIcons = {
    up: { icon: '↗', color: 'text-green-600' },
    down: { icon: '↘', color: 'text-red-600' },
    stable: { icon: '→', color: 'text-gray-600' },
  };

  const currentColor = colorClasses[color] || colorClasses.blue;
  const currentTrend = trendIcons[trend] || trendIcons.stable;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-full ${currentColor.bg} ${currentColor.border} border`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center">
          <span className={`inline-flex items-center ${currentTrend.color}`}>
            <span className="text-lg">{currentTrend.icon}</span>
            <span className="ml-1 text-sm font-medium">{change}%</span>
          </span>
          <span className="text-sm text-gray-500 ml-2">vs. período anterior</span>
        </div>
        <div className="text-sm text-gray-500">
          Média: <span className="font-medium">{avg}/dia</span>
        </div>
      </div>
      
      {/* Progress bar para visualizar a média */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0</span>
          <span>Média: {avg}</span>
          <span>{Math.max(value, avg * 2)}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${currentColor.bg} rounded-full`}
            style={{ width: `${Math.min((value / (avg * 2 || value)) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}