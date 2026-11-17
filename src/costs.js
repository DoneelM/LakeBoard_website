import { hostingEstimate, usd } from './cost-model.js';
const input = document.querySelector('#dashboard-count');
const output = document.querySelector('#dashboard-count-value');
function update() {
  const estimate = hostingEstimate(Number(input.value));
  output.value = estimate.dashboards;
  document.querySelector('#shared-cost-bar').style.setProperty('--shared-ratio', String(1 / estimate.dashboards));
  document.querySelector('#separate-app-count').textContent = estimate.dashboards;
  document.querySelector('#separate-app-cost').textContent = usd(estimate.separateAnnual);
  document.querySelector('#shared-app-cost').textContent = usd(estimate.sharedAnnual);
  document.querySelector('#hosting-saved').textContent = usd(estimate.savedAnnual);
  document.querySelector('#hosting-percent').textContent = `${Number(estimate.savedPercent.toFixed(1))}%`;
  document.querySelector('#per-dashboard-cost').textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(estimate.sharedPerDashboard);
}
input.addEventListener('input', update);
update();

// Expanded source notes change the positions of the following reveal sections.
document.querySelector('.cost-method').addEventListener('toggle', () => {
  dispatchEvent(new Event('lakeboard:layout'));
});
