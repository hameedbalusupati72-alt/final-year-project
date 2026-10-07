export function formatNumber(value, maximumFractionDigits = 2) {
  const number = Number(value);
  return Number.isFinite(number)
    ? new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(number)
    : "—";
}

export function formatDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value < 0) return "—";
  return `${value.toFixed(value < 1 ? 3 : 2)} s`;
}

export function formatPercentage(value, digits = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? `${(number * 100).toFixed(digits)}%` : "—";
}

export function formatTimestamp(timestamp) {
  if (!timestamp) return "Not run";
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "Not run" : date.toLocaleString();
}
