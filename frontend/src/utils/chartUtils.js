export function sortCountsDescending(counts = {}) {
  return Object.entries(counts).sort(
    ([firstOutcome, firstCount], [secondOutcome, secondCount]) =>
      secondCount - firstCount || firstOutcome.localeCompare(secondOutcome),
  );
}

export function countsToProbabilities(counts = {}) {
  const entries = Object.entries(counts);
  const total = entries.reduce((sum, [, count]) => sum + Number(count || 0), 0);
  if (!total) return {};
  return Object.fromEntries(
    entries.map(([outcome, count]) => [outcome, Number(count) / total]),
  );
}

export function normalizeChartSeries(series = []) {
  return series
    .filter((point) => Number.isFinite(Number(point.value)))
    .map((point) => ({
      ...point,
      value: Math.max(0, Number(point.value)),
    }));
}
