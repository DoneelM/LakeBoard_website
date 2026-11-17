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
export const APP_SIZES = Object.freeze({
  medium: Object.freeze({ memoryGb: 6, upToVcpus: 2, dbuPerHour: 0.5 }),
  large: Object.freeze({ memoryGb: 12, upToVcpus: 4, dbuPerHour: 1 }),
  xlarge: Object.freeze({ memoryGb: 48, upToVcpus: 12, dbuPerHour: 3 })
});
export function appAnnual(size = 'medium', instances = 1) {
  if (!Object.hasOwn(APP_SIZES, size) || !Number.isInteger(instances) || instances < 1) throw new RangeError('Choose an app size and positive instance count');
  return APP_SIZES[size].dbuPerHour * PRICING.appPricePerDbu * PRICING.hoursPerYear * instances;
}
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
