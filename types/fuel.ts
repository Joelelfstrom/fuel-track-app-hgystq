
export interface FuelEntry {
  id: string;
  date: string;
  cost: number;
  amount: number;
  pricePerUnit: number;
  odometer?: number;
  notes?: string;
}

export interface AppSettings {
  language: 'en' | 'es' | 'fr' | 'de' | 'sv';
  currency: string;
  unit: 'liters' | 'gallons';
}

export interface MonthlyStats {
  month: string;
  totalCost: number;
  totalAmount: number;
  averagePricePerUnit: number;
  entryCount: number;
}

export interface YearlyStats {
  year: string;
  totalCost: number;
  totalAmount: number;
  averagePricePerUnit: number;
  entryCount: number;
  monthlyBreakdown: MonthlyStats[];
}
