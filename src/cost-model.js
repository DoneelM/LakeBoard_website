// Public list-price snapshot, 18 November 2026 (NZ), Azure Australia East, USD.
// Source meter records and query URLs: ../docs/pricing-snapshot.json.
export const PRICING = Object.freeze({
  hoursPerYear: 8760,
  fabricPaygPerCuHour: 0.21,
  fabricReservationPerCuYear: 1094,
  appDbuPerHour: 0.5,
  appPricePerDbu: 1,
  defaultDashboards: 50
});
export function fabricAnnual(cu, basis = 'payg') {
  if (![64, 128, 256].includes(cu)) throw new RangeError('Use F64, F128 or F256');
  if (!['payg', 'reserved'].includes(basis)) throw new RangeError('Unknown pricing basis');
  return basis === 'reserved' ? cu * PRICING.fabricReservationPerCuYear : cu * PRICING.fabricPaygPerCuHour * PRICING.hoursPerYear;
}
export function hostingEstimate(dashboards) {
  if (!Number.isInteger(dashboards) || dashboards < 1 || dashboards > 100) throw new RangeError('Use 1 to 100 dashboards');
  const hourly = PRICING.appDbuPerHour * PRICING.appPricePerDbu;
  const sharedAnnual = hourly * PRICING.hoursPerYear;
  return {
    dashboards,
    hourly,
    sharedAnnual,
    separateAnnual: sharedAnnual * dashboards,
    savedAnnual: sharedAnnual * (dashboards - 1),
    savedPercent: 100 * (dashboards - 1) / dashboards,
    sharedPerDashboard: sharedAnnual / dashboards
  };
}
export const usd = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
