export interface Comment {
  id: string;
  projectId: string;
  text: string;
  timestamp: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  size: string;
  timestamp: string;
  url: string;
}

export type ProjectStatus = 
  | 'contract' 
  | 'advance' 
  | 'order' 
  | 'shipment' 
  | 'launch' 
  | 'closing' 
  | 'final_payment' 
  | 'completed' 
  | 'cancelled';

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  duration?: number;
  totalCost: number;
  status: ProjectStatus;
}

export interface Client {
  id: string;
  name: string;
  projectsCount: number;
  totalRevenue: number;
}

export interface ProjectExpense {
  id: string;
  projectId: string;
  category: string;
  amount: number;
}

export const EXPENSE_CATEGORIES = [
  'Стоимость товара',
  'Комиссия банка за перевод',
  'Доставка из-за рубежа',
  'Таможенное оформление',
  'Оформление ДС',
  'Пошлины',
  'Доставка Аэропорт-Склад',
  'Хранение на складе',
  'Доставка по РФ',
  'Комиссия банка за перевод',
] as const;

export const PROJECT_STATUSES: Record<ProjectStatus, { label: string; color: string; icon: string; progress: number }> = {
  contract: { label: 'Договор', color: 'bg-blue-500', icon: 'FileText', progress: 10 },
  advance: { label: 'Аванс', color: 'bg-yellow-500', icon: 'DollarSign', progress: 20 },
  order: { label: 'Заказ', color: 'bg-amber-500', icon: 'ShoppingCart', progress: 30 },
  shipment: { label: 'Отгрузка', color: 'bg-orange-500', icon: 'Truck', progress: 50 },
  launch: { label: 'Запуск', color: 'bg-cyan-500', icon: 'Rocket', progress: 65 },
  closing: { label: 'Закрывающие', color: 'bg-purple-500', icon: 'FileCheck', progress: 80 },
  final_payment: { label: 'Финальная оплата', color: 'bg-indigo-500', icon: 'Banknote', progress: 90 },
  completed: { label: 'Завершено', color: 'bg-green-500', icon: 'CheckCircle2', progress: 100 },
  cancelled: { label: 'Отменено', color: 'bg-red-500', icon: 'XCircle', progress: 0 },
};