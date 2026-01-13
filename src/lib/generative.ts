import { AnalyticsData, Insight } from "@/types";


export function generateInsights(data: AnalyticsData[]): Insight[] {
  const insights: Insight[] = [];
  
  if (data.length === 0) return insights;
  
  // Calcular totais
  const totals = data.reduce((acc, day) => ({
    activeUsers: acc.activeUsers + day.activeUsers,
    sessions: acc.sessions + day.sessions,
    pageViews: acc.pageViews + day.pageViews,
    engagedSessions: acc.engagedSessions + day.engagedSessions,
  }), { activeUsers: 0, sessions: 0, pageViews: 0, engagedSessions: 0 });
  
  // Calcular taxas
  const avgEngagementRate = (totals.engagedSessions / totals.sessions * 100) || 0;
  const avgViewsPerSession = totals.pageViews / totals.sessions || 0;
  
  // Insight 1: Engajamento
  if (avgEngagementRate > 70) {
    insights.push({
      title: 'Excelente Engajamento! 🎯',
      description: `Taxa de engajamento de ${avgEngagementRate.toFixed(1)}% indica conteúdo altamente relevante.`,
      type: 'positive',
      icon: '🎯',
    });
  } else if (avgEngagementRate > 50) {
    insights.push({
      title: 'Bom Nível de Engajamento',
      description: `Taxa de engajamento de ${avgEngagementRate.toFixed(1)}%. Os usuários estão interagindo bem.`,
      type: 'positive',
      icon: '📈',
    });
  } else if (avgEngagementRate > 30) {
    insights.push({
      title: 'Engajamento Moderado',
      description: `Taxa de engajamento de ${avgEngagementRate.toFixed(1)}%. Há oportunidades de melhoria.`,
      type: 'info',
      icon: '📊',
    });
  } else {
    insights.push({
      title: 'Baixo Engajamento Detectado',
      description: `Taxa de engajamento de ${avgEngagementRate.toFixed(1)}%. Considere otimizar o conteúdo.`,
      type: 'warning',
      icon: '⚠️',
    });
  }
  
  // Insight 2: Pico de tráfego
  const maxTrafficDay = data.reduce((max, day) => 
    day.pageViews > max.pageViews ? day : max, data[0]
  );
  
  insights.push({
    title: 'Dia de Pico de Tráfego',
    description: `${maxTrafficDay.date} teve ${maxTrafficDay.pageViews} visualizações, o maior volume do período.`,
    type: 'info',
    icon: '📊',
  });
  
  // Insight 3: Crescimento de usuários
  if (data.length >= 4) {
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.activeUsers, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.activeUsers, 0) / secondHalf.length;
    
    const growth = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg * 100) || 0;
    
    if (growth > 20) {
      insights.push({
        title: 'Crescimento Acelerado! 🚀',
        description: `Crescimento de ${growth.toFixed(1)}% na segunda metade do período analisado.`,
        type: 'positive',
        icon: '🚀',
      });
    } else if (growth > 0) {
      insights.push({
        title: 'Crescimento Positivo',
        description: `Crescimento de ${growth.toFixed(1)}% no número de usuários ativos.`,
        type: 'positive',
        icon: '📈',
      });
    }
  }
  
  // Insight 4: Visualizações por sessão
  if (avgViewsPerSession > 4) {
    insights.push({
      title: 'Alto Engajamento por Sessão',
      description: `Usuários visualizam ${avgViewsPerSession.toFixed(1)} páginas por sessão em média.`,
      type: 'positive',
      icon: '👁️',
    });
  } else if (avgViewsPerSession < 2) {
    insights.push({
      title: 'Baixa Exploração de Conteúdo',
      description: `Apenas ${avgViewsPerSession.toFixed(1)} páginas por sessão. Considere melhorar a navegação.`,
      type: 'warning',
      icon: '🔍',
    });
  }
  
  // Insight 5: Consistência
  const activeUsersStdDev = calculateStdDev(data.map(d => d.activeUsers));
  if (activeUsersStdDev < 5) {
    insights.push({
      title: 'Tráfego Consistente',
      description: 'O número de usuários ativos mostra baixa variação diária, indicando estabilidade.',
      type: 'positive',
      icon: '📅',
    });
  }
  
  return insights.slice(0, 4); // Retornar até 4 insights
}

// Função auxiliar para calcular desvio padrão
function calculateStdDev(numbers: number[]): number {
  const n = numbers.length;
  const mean = numbers.reduce((a, b) => a + b) / n;
  const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
  return Math.sqrt(variance);
}