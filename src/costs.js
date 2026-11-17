import { hostingEstimate, usd } from './cost-model.js';
const input = document.querySelector('#dashboard-count');
const output = document.querySelector('#dashboard-count-value');
const schedule = document.querySelector('#hosting-schedule');
function update() {
  const estimate = hostingEstimate(Number(input.value), schedule.value);
  output.value = estimate.dashboards;
  document.querySelector('#hosting-hours').textContent = estimate.schedule === 'business' ? 'About 2,600 hours/year: 10 hours × 5 weekdays × 52 weeks.' : '8,760 hours/year: one non-leap year, running 24/7.';
  document.querySelector('#shared-cost-bar').style.setProperty('--shared-ratio', String(1 / estimate.dashboards));
  document.querySelector('#separate-app-count').textContent = estimate.dashboards;
  document.querySelector('#separate-app-cost').textContent = usd(estimate.separateAnnual);
  document.querySelector('#shared-app-cost').textContent = usd(estimate.sharedAnnual);
  document.querySelector('#hosting-saved').textContent = usd(estimate.savedAnnual);
  document.querySelector('#hosting-percent').textContent = `${Number(estimate.savedPercent.toFixed(1))}%`;
  document.querySelector('#per-dashboard-cost').textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(estimate.sharedPerDashboard);
}
input.addEventListener('input', update);
schedule.addEventListener('change', () => {
  update();
  dispatchEvent(new Event('lakeboard:layout'));
});
update();

// Expanded source notes change the positions of the following reveal sections.
document.querySelector('.cost-method').addEventListener('toggle', () => {
  dispatchEvent(new Event('lakeboard:layout'));
});
