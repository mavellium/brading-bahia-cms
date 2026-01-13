export interface FAQ {
  question: string;
  answer: string;
}

export interface Service {
  id?: string;
  title: string;
  description: string;
  image: string;
  file?: File | null;
}

export interface FormDataType {
  id: string;
  type: string;
  values: Service[];
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Tipos para dados de analytics
export interface AnalyticsData {
  date: string;
  activeUsers: number;
  sessions: number;
  pageViews: number;
  engagedSessions: number;
}

export interface TotalMetrics {
  activeUsers: number;
  sessions: number;
  pageViews: number;
  engagedSessions: number;
}

export interface AverageMetrics {
  activeUsers: number;
  sessions: number;
  pageViews: number;
  engagedSessions: number;
}

export interface Insight {
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info';
  icon: string;
}

export type ChartType = 'line' | 'bar' | 'pie';
export type TrendType = 'up' | 'down' | 'stable';
export type ColorType = 'blue' | 'purple' | 'green' | 'orange' | 'red';

export interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  trend: TrendType;
  icon: string;
  color: ColorType;
  avg: number;
}

export interface ChartProps {
  data: AnalyticsData[];
  type: ChartType;
  height?: number;
}

export interface DateFilterProps {
  onFilterChange: (range: string) => void;
  currentRange: string;
}