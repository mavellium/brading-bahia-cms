'use client';

import { AnalyticsData } from "@/types";


interface DataTableProps {
  data: AnalyticsData[];
}

export default function DataTable({ data }: DataTableProps) {
  // Calcular taxa de engajamento
  const calculateEngagementRate = (engagedSessions: number, sessions: number): number => {
    return sessions > 0 ? (engagedSessions / sessions) * 100 : 0;
  };

  // Calcular totais
  const totals = data.reduce((acc, day) => ({
    activeUsers: acc.activeUsers + day.activeUsers,
    sessions: acc.sessions + day.sessions,
    pageViews: acc.pageViews + day.pageViews,
    engagedSessions: acc.engagedSessions + day.engagedSessions,
  }), { activeUsers: 0, sessions: 0, pageViews: 0, engagedSessions: 0 });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Dados Detalhados por Dia</h3>
          <p className="text-sm text-gray-500">Análise diária de todas as métricas</p>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
          {data.length} registros
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuários Ativos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sessões
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visualizações
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sessões Engajadas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taxa de Engajamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visualizações/Sessão
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((day: AnalyticsData, index: number) => {
              const engagementRate = calculateEngagementRate(day.engagedSessions, day.sessions);
              const viewsPerSession = day.sessions > 0 ? (day.pageViews / day.sessions).toFixed(1) : '0.0';
              
              return (
                <tr 
                  key={index} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {day.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.activeUsers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.sessions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.pageViews}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.engagedSessions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${engagementRate > 60 
                      ? 'bg-green-100 text-green-800' 
                      : engagementRate > 40 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'}`}
                    >
                      {engagementRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {viewsPerSession}
                  </td>
                </tr>
              );
            })}
            
            {/* Linha de totais */}
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                TOTAL
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {totals.activeUsers}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {totals.sessions}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {totals.pageViews}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {totals.engagedSessions}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {calculateEngagementRate(totals.engagedSessions, totals.sessions).toFixed(1)}%
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {(totals.sessions > 0 ? (totals.pageViews / totals.sessions).toFixed(1) : '0.0')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}