/**
 * Compute AI-style savings projections based on transaction history.
 * Uses a simple monthly average extrapolated over 12 months.
 */
type Category = { id: string; name: string; icon: string; color: string; limit: number };
type Transaction = { categoryId: string; amount: number; date: string };
export function computeInsights({ transactions, monthlyIncome, categories }: {
  transactions: Transaction[];
  monthlyIncome: number;
  categories: Category[];
}) {
  const now = new Date();

  // Group transactions by month
  const byMonth: Record<string, number> = {};
  transactions.forEach(t => {
    const month = t.date.slice(0, 7);
    byMonth[month] = (byMonth[month] || 0) + t.amount;
  });

  const months = Object.keys(byMonth).sort();
  const monthlyTotals = months.map(m => byMonth[m]);

  // Use up to last 3 months for avg
  const recent = monthlyTotals.slice(-3);
  const avgMonthlySpend = recent.length
    ? recent.reduce((a, b) => a + b, 0) / recent.length
    : monthlyTotals.reduce((a, b) => a + b, 0) / (monthlyTotals.length || 1);

  const monthlySaving = monthlyIncome - avgMonthlySpend;
  const yearlySaving = monthlySaving * 12;

  // Per-category averages
  const catByMonth: Record<string, Record<string, number>> = {};
  transactions.forEach(t => {
    const month = t.date.slice(0, 7);
    if (!catByMonth[t.categoryId]) catByMonth[t.categoryId] = {};
    catByMonth[t.categoryId][month] = (catByMonth[t.categoryId][month] || 0) + t.amount;
  });

  const categoryInsights = categories.map(cat => {
    const catMonths = catByMonth[cat.id] || {};
    const vals = Object.values(catMonths);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    const trend = vals.length >= 2 ? vals[vals.length - 1] - vals[vals.length - 2] : 0;
    const overBudgetMonths = vals.filter(v => v > cat.limit).length;
    return {
      ...cat,
      avgMonthlySpend: avg,
      trend,
      overBudgetMonths,
      yearlyProjection: avg * 12,
      potentialSaving: Math.max(0, (avg - cat.limit) * 12),
    };
  });

  // Suggestions
  const suggestions: Array<{ type: string; text: string }> = [];
  categoryInsights.forEach(c => {
    if (c.trend > 0 && c.avgMonthlySpend > c.limit * 0.8) {
      suggestions.push({
        type: 'warning',
        text: `${c.icon} ${c.name} : dépenses en hausse (+${c.trend.toFixed(0)}€/mois). Envisagez de réduire le budget.`,
      });
    }
    if (c.potentialSaving > 100) {
      suggestions.push({
        type: 'info',
        text: `${c.icon} ${c.name} : économiser jusqu'à ${c.potentialSaving.toFixed(0)}€/an en restant dans le budget.`,
      });
    }
    if (c.avgMonthlySpend < c.limit * 0.5 && c.avgMonthlySpend > 0) {
      suggestions.push({
        type: 'success',
        text: `${c.icon} ${c.name} : vous utilisez seulement ${Math.round((c.avgMonthlySpend / c.limit) * 100)}% du budget — bien joué !`,
      });
    }
  });

  // Build monthly chart data (last 6 months + projections)
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    chartData.push({
      month: d.toLocaleDateString('fr-BE', { month: 'short' }),
      dépenses: byMonth[key] || 0,
      revenus: monthlyIncome,
      épargne: Math.max(0, monthlyIncome - (byMonth[key] || 0)),
    });
  }

  return {
    avgMonthlySpend,
    monthlySaving,
    yearlySaving,
    categoryInsights,
    suggestions,
    chartData,
  };
}
