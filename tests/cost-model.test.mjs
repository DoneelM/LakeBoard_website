import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PRICING, fabricAnnual, hostingEstimate } from '../src/cost-model.js';
const snapshot = JSON.parse(await readFile(new URL('../docs/pricing-snapshot.json', import.meta.url), 'utf8'));

test('rates match the captured Australia East USD meters', () => {
  const payg = snapshot.meters.find(m => m.serviceName === 'Microsoft Fabric' && m.type === 'Consumption');
  const reserved = snapshot.meters.find(m => m.reservationTerm === '1 Year');
  const app = snapshot.meters.find(m => m.meterName === 'Premium Interactive Serverless Compute DBU');
  for (const meter of [payg, reserved, app]) {
    assert.equal(meter.armRegionName, 'australiaeast');
    assert.equal(meter.currencyCode, 'USD');
  }
  assert.equal(PRICING.fabricPaygPerCuHour, payg.retailPrice);
  assert.equal(PRICING.fabricReservationPerCuYear, reserved.retailPrice);
  assert.equal(PRICING.appPricePerDbu, app.retailPrice);
});
test('24/7 PAYG uses 365 days and reservation uses the full-year price once', () => {
  assert.equal(fabricAnnual(64), 117734.4);
  assert.equal(fabricAnnual(128), 235468.8);
  assert.equal(fabricAnnual(256), 470937.6);
  assert.equal(fabricAnnual(64, 'reserved'), 70016);
  assert.equal(fabricAnnual(128, 'reserved'), 140032);
  assert.equal(fabricAnnual(256, 'reserved'), 280064);
});
test('capacity reductions are distinct from the avoided upgrade', () => {
  assert.equal(fabricAnnual(256) - fabricAnnual(128), 235468.8);
  assert.equal(fabricAnnual(128) - fabricAnnual(64), 117734.4);
  assert.ok(Math.abs(fabricAnnual(256) - fabricAnnual(64) - 353203.2) < 0.01);
  assert.equal(fabricAnnual(128, 'reserved') - fabricAnnual(64, 'reserved'), 70016);
});
test('50 standalone Medium instances versus one shared instance', () => {
  const result = hostingEstimate(50);
  assert.equal(result.hourly, 0.5);
  assert.equal(result.sharedAnnual, 4380);
  assert.equal(result.separateAnnual, 219000);
  assert.equal(result.savedAnnual, 214620);
  assert.equal(result.savedPercent, 98);
  assert.equal(result.sharedPerDashboard, 87.6);
});
test('one dashboard has no consolidation saving; count changes do not make the shared instance free', () => {
  assert.equal(hostingEstimate(1).savedAnnual, 0);
  assert.equal(hostingEstimate(1).savedPercent, 0);
  assert.equal(hostingEstimate(100).sharedAnnual, 4380);
  assert.equal(hostingEstimate(100).separateAnnual, 438000);
  for (const invalid of [0, -1, 101, 2.5, NaN, '50']) assert.throws(() => hostingEstimate(invalid), RangeError);
});
