
import { FuelEntry, MonthlyStats, YearlyStats } from '@/types/fuel';

export const calculateMonthlyStats = (entries: FuelEntry[]): MonthlyStats[] => {
  const monthlyMap = new Map<string, FuelEntry[]>();

  entries.forEach(entry => {
    const date = new Date(entry.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, []);
    }
    monthlyMap.get(monthKey)!.push(entry);
  });

  const stats: MonthlyStats[] = [];
  monthlyMap.forEach((monthEntries, monthKey) => {
    const totalCost = monthEntries.reduce((sum, entry) => sum + entry.cost, 0);
    const totalAmount = monthEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const averagePricePerUnit = totalAmount > 0 ? totalCost / totalAmount : 0;

    stats.push({
      month: monthKey,
      totalCost,
      totalAmount,
      averagePricePerUnit,
      entryCount: monthEntries.length,
    });
  });

  return stats.sort((a, b) => b.month.localeCompare(a.month));
};

export const calculateYearlyStats = (entries: FuelEntry[]): YearlyStats[] => {
  const yearlyMap = new Map<string, FuelEntry[]>();

  entries.forEach(entry => {
    const date = new Date(entry.date);
    const yearKey = String(date.getFullYear());
    
    if (!yearlyMap.has(yearKey)) {
      yearlyMap.set(yearKey, []);
    }
    yearlyMap.get(yearKey)!.push(entry);
  });

  const stats: YearlyStats[] = [];
  yearlyMap.forEach((yearEntries, yearKey) => {
    const totalCost = yearEntries.reduce((sum, entry) => sum + entry.cost, 0);
    const totalAmount = yearEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const averagePricePerUnit = totalAmount > 0 ? totalCost / totalAmount : 0;

    const monthlyBreakdown = calculateMonthlyStats(yearEntries);

    stats.push({
      year: yearKey,
      totalCost,
      totalAmount,
      averagePricePerUnit,
      entryCount: yearEntries.length,
      monthlyBreakdown,
    });
  });

  return stats.sort((a, b) => b.year.localeCompare(a.year));
};

export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatAmount = (amount: number, unit: 'liters' | 'gallons'): string => {
  return `${amount.toFixed(2)} ${unit === 'liters' ? 'L' : 'gal'}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatMonthYear = (monthKey: string): string => {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};
