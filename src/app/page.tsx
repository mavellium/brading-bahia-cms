'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { generateInsights } from '@/lib/generative';
import { 
  AnalyticsData, 
  Insight, 
  TotalMetrics, 
  AverageMetrics 
} from '@/types';
import DateFilter from '@/components/DataFilter';
import MetricCard from '@/components/MetricCard';
import DataTable from '@/components/DataTable';

// Carregar componente de gráfico dinamicamente
const Chart = dynamic(() => import("@/components/Chart"), { 
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center">Carregando gráfico...</div>
});

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [filteredData, setFilteredData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [timeRange, setTimeRange] = useState<string>('7d');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/analytics');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const analyticsData: AnalyticsData[] = await response.json();
      setData(analyticsData);
      setFilteredData(analyticsData);
      
      // Gerar insights generativos baseados nos dados
      const generatedInsights = generateInsights(analyticsData);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Falha ao carregar dados. Tente novamente mais tarde.');
      
      // Dados de fallback para demonstração
      const fallbackData: AnalyticsData[] = [
        { date: "15/12", activeUsers: 11, sessions: 12, pageViews: 20, engagedSessions: 6 },
        { date: "16/12", activeUsers: 10, sessions: 10, pageViews: 24, engagedSessions: 7 },
        { date: "17/12", activeUsers: 6, sessions: 13, pageViews: 55, engagedSessions: 8 },
      ];
      setData(fallbackData);
      setFilteredData(fallbackData);
      setInsights(generateInsights(fallbackData));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateFilter = (range: string): void => {
    setTimeRange(range);
    
    // Em uma implementação real, isso faria uma nova requisição à API
    if (range === '7d') {
      setFilteredData(data.slice(-7));
    } else if (range === '30d') {
      // Simulação de mais dados para 30 dias
      const extendedData: AnalyticsData[] = [...data];
      for (let i = 8; i <= 30; i++) {
        extendedData.push({
          date: `${i}/12`,
          activeUsers: Math.floor(Math.random() * 30) + 5,
          sessions: Math.floor(Math.random() * 35) + 5,
          pageViews: Math.floor(Math.random() * 60) + 10,
          engagedSessions: Math.floor(Math.random() * 15) + 2
        });
      }
      setFilteredData(extendedData);
    }
  };

  // Calcular métricas totais
  const calculateTotalMetrics = (): TotalMetrics => {
    return filteredData.reduce((acc: TotalMetrics, day: AnalyticsData) => ({
      activeUsers: acc.activeUsers + day.activeUsers,
      sessions: acc.sessions + day.sessions,
      pageViews: acc.pageViews + day.pageViews,
      engagedSessions: acc.engagedSessions + day.engagedSessions,
    }), { activeUsers: 0, sessions: 0, pageViews: 0, engagedSessions: 0 });
  };

  // Calcular métricas médias
  const calculateAverageMetrics = (): AverageMetrics => {
    const totals = calculateTotalMetrics();
    const count = filteredData.length || 1; // Evitar divisão por zero
    
    return {
      activeUsers: Math.round(totals.activeUsers / count),
      sessions: Math.round(totals.sessions / count),
      pageViews: Math.round(totals.pageViews / count),
      engagedSessions: Math.round(totals.engagedSessions / count),
    };
  };

  const totalMetrics: TotalMetrics = calculateTotalMetrics();
  const avgMetrics: AverageMetrics = calculateAverageMetrics();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse h-96"></div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-red-800">Erro ao carregar dados</h3>
              <p className="text-red-700 mt-2">{error}</p>
              <button
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header com filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="pl-[60px]">
          <h2 className="text-2xl font-bold text-gray-900">Visão Geral</h2>
          <p className="text-gray-600">Análise em tempo real das métricas do seu CMS</p>
        </div>
        <div className="flex items-center gap-4">
          <DateFilter onFilterChange={handleDateFilter} currentRange={timeRange} />
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">🔄</span>
            <span className="text-sm font-medium">Atualizar</span>
          </button>
        </div>
      </div>

      {/* Insights Gerativos */}
      {insights.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Insights Generativos</h3>
            <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-medium rounded-full">
              IA
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight: Insight, index: number) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border transform transition-transform duration-300 hover:scale-[1.02] ${insight.type === 'positive' 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' 
                  : insight.type === 'warning' 
                  ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100' 
                  : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${insight.type === 'positive' 
                    ? 'bg-green-100' 
                    : insight.type === 'warning' 
                    ? 'bg-yellow-100' 
                    : 'bg-blue-100'}`}
                  >
                    <span className="text-lg">{insight.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{insight.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Usuários Ativos"
          value={totalMetrics.activeUsers}
          change={12}
          trend="up"
          icon="👥"
          color="blue"
          avg={avgMetrics.activeUsers}
        />
        <MetricCard
          title="Sessões"
          value={totalMetrics.sessions}
          change={8}
          trend="up"
          icon="📊"
          color="purple"
          avg={avgMetrics.sessions}
        />
        <MetricCard
          title="Visualizações"
          value={totalMetrics.pageViews}
          change={15}
          trend="up"
          icon="👁️"
          color="green"
          avg={avgMetrics.pageViews}
        />
        <MetricCard
          title="Sessões Engajadas"
          value={totalMetrics.engagedSessions}
          change={5}
          trend="up"
          icon="🎯"
          color="orange"
          avg={avgMetrics.engagedSessions}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Visão Geral das Métricas</h3>
              <p className="text-sm text-gray-500">Evolução diária</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {filteredData.length} dias
            </span>
          </div>
          <Chart data={filteredData} type="line" height={300} />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Comparativo por Métrica</h3>
              <p className="text-sm text-gray-500">Distribuição por tipo</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              Total
            </span>
          </div>
          <Chart data={filteredData} type="bar" height={300} />
        </div>
      </div>

      {/* Tabela de Dados Detalhados */}
      <DataTable data={filteredData} />
    </div>
  );
}