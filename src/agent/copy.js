(() => {
  const button = document.querySelector('#copy-markdown');
  const context = document.querySelector('#agent-context');
  const status = document.querySelector('#agent-copy-status');

  button.hidden = false;
  button.addEventListener('click', async () => {
    status.textContent = '';
    try {
      await navigator.clipboard.writeText(context.textContent);
      status.textContent = 'Markdown copied.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(context);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Markdown selected. Use your browser’s copy shortcut.';
    }
  });
})();
