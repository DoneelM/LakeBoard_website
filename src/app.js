(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const dashboards = {
    'city-trips': ['City Trips', 'Explore New York taxi trips through date filters, daily trends and an hourly heatmap.'],
    'sales-margin': ['Sales & Margin', 'Follow sales performance, margin and the commercial drivers behind the totals.'],
    'bakery-franchises': ['Bakery Franchises', 'Compare bakery franchise performance and explore the shape of the business.'],
    'travel-marketplace': ['Travel Marketplace', 'Explore booking performance, destinations and travel marketplace trends.'],
    'guest-experience': ['Guest Experience', 'See the guest experience through service, feedback and hospitality measures.'],
    'omnichannel-retail': ['Omnichannel Retail', 'Bring retail channels, sales and customer journeys into one report.'],
    'world-weather': ['World Weather', 'Explore weather patterns through geographic views and climate trends.']
  };
  const galleryImage = $('#gallery-image');
  $$('.dashboard-choice').forEach((button) => button.addEventListener('click', () => {
    const slug = button.dataset.dashboard;
    const [name, description] = dashboards[slug];
    $$('.dashboard-choice').forEach((choice) => {
      const active = choice === button;
      choice.classList.toggle('active', active);
      choice.setAttribute('aria-pressed', String(active));
    });
    galleryImage.src = `./assets/${slug}.jpg`;
    galleryImage.alt = `${name} dashboard. ${description}`;
    $('#gallery-open').href = galleryImage.src;
    $('#gallery-open').setAttribute('aria-label', `Enlarge capture: ${name} dashboard`);
    $('#gallery-name').textContent = name;
    $('#gallery-description').textContent = description;
  }));

  const files = {
    manifest: ['THE MANIFEST', 'Declare what the dashboard needs.', 'Its title, owner, filters, query parameters and navigation belong in a reviewable configuration file.', 'Configuration in Git. Shared shell at runtime.'],
    queries: ['THE DATA', 'Keep the queries reviewable.', 'Read-only, parameterized SQL lives beside the dashboard. Declare each filter parameter in the manifest and use fully qualified source names.', 'Read-only SQL. Viewer-authorized access by default.'],
    view: ['THE PRESENTATION', 'Make the report your own.', 'The dashboard page uses the shared kit for filters, KPI tiles, charts, tables, maps and CSV export. Theme variables keep it aligned with the portal.', 'Your layout. Shared components, theme and locale.'],
    readme: ['THE HANDOVER', 'Leave context for the next author.', 'Document the business purpose, owner, data sources and validation. When replacing a Power BI report, reconcile the numbers and record the results.', 'A dashboard is code, definitions and evidence.']
  };
  $$('[data-file]').forEach((button) => button.addEventListener('click', () => {
    $$('[data-file]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
      item.classList.toggle('active', item === button);
    });
    const values = files[button.dataset.file];
    ['file-kind', 'file-title', 'file-description', 'file-note'].forEach((id, i) => { $(`#${id}`).textContent = values[i]; });
  }));

  const dialog = $('#capture-dialog');
  let opener;
  function enlarge(event) {
    if (!dialog.showModal) return;
    event.preventDefault();
    opener = event.currentTarget;
    const img = opener.querySelector('img');
    $('#capture-title').textContent = opener.dataset.enlarge || $('#gallery-name').textContent;
    $('#dialog-image').src = img?.src || opener.href;
    $('#dialog-image').alt = img?.alt || opener.dataset.enlarge || 'LakeBoard product capture';
    document.body.classList.add('dialog-open');
    dialog.showModal();
  }
  [$('#gallery-open'), ...$$('[data-enlarge]')].forEach((link) => link.addEventListener('click', enlarge));
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    opener?.focus({ preventScroll: true });
  });

  $('#copy-clone').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('git clone https://github.com/DoneelM/LakeBoard.git');
      $('#copy-status').textContent = 'Command copied.';
    } catch {
      $('#copy-status').textContent = 'Select and copy the command above.';
    }
  });

  // The upstream Scroll Craft engine is unchanged. This assembly choreography
  // belongs to the page: independent reports converge into a common host.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 760px), (max-height: 600px)');
  let userReduced = false;
  try { userReduced = localStorage.getItem('lakeboard-reduce-motion') === 'true'; } catch { /* Storage is optional. */ }
  let runtime;
  let frame = 0;
  const assembly = $('.assembly');
  const cards = [$('.card-city'), $('.card-travel'), $('.card-weather')];
  const starts = [[-170, 10, -8, .9], [185, -25, 9, .86], [20, -95, 2, .84]];
  const ends = [[0, 0, 0, 1], [5, 5, 0, .993], [10, 10, 0, .986]];
  function settleAssembly() {
    const motion = !reduced.matches && !userReduced && !compact.matches;
    let t = 1;
    if (motion) {
      const bounds = assembly.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height - innerHeight)));
      const raw = Math.max(0, Math.min(1, (p - .02) / .78));
      t = raw * raw * (3 - 2 * raw);
    }
    cards.forEach((card, i) => {
      const values = starts[i].map((from, j) => from + (ends[i][j] - from) * t);
      card.style.transform = `translate3d(${values[0]}px,${values[1]}px,0) rotate(${values[2]}deg) scale(${values[3]})`;
    });
    assembly.style.setProperty('--host-opacity', String(.08 + .92 * t));
    assembly.style.setProperty('--host-text', t >= 1 ? '1' : '0');
    assembly.style.setProperty('--label-opacity', String(Math.max(0, 1 - t * 1.8)));
    $('.assembly-state').textContent = t > .9 ? 'One app / many dashboards' : 'Separate folders → shared host';
  }
  function queueAssembly() {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; settleAssembly(); });
  }
  function configureMotion() {
    if (runtime) { runtime.destroy(); runtime = null; }
    const off = reduced.matches || userReduced;
    document.documentElement.classList.toggle('no-motion', off);
    document.documentElement.classList.toggle('compact', compact.matches);
    // Remove only properties owned by the prior runtime. A viewport or motion
    // change must never leave a hidden reveal or a desktop-sized scroll spacer.
    assembly.style.removeProperty('height');
    $$('[data-sc-parallax], [data-sc-tilt]').forEach((el) => { el.style.removeProperty('transform'); });
    $$('[data-sc-reveal]').forEach((el) => { el.style.removeProperty('clip-path'); });
    if (!off && !compact.matches && window.ScrollCraft) runtime = ScrollCraft.mount(document);
    const button = $('#motion-toggle');
    button.hidden = false;
    button.disabled = reduced.matches;
    button.setAttribute('aria-pressed', String(off));
    button.textContent = reduced.matches ? 'System: reduced motion' : (userReduced ? 'Enable motion' : 'Reduce motion');
    settleAssembly();
  }
  $('#motion-toggle').addEventListener('click', () => {
    userReduced = !userReduced;
    try { localStorage.setItem('lakeboard-reduce-motion', String(userReduced)); } catch { /* Optional preference. */ }
    configureMotion();
  });
  reduced.addEventListener('change', configureMotion);
  compact.addEventListener('change', configureMotion);
  addEventListener('scroll', queueAssembly, { passive: true });
  addEventListener('resize', queueAssembly, { passive: true });
  addEventListener('lakeboard:layout', () => { runtime?.layout(); queueAssembly(); });
  configureMotion();
})();
