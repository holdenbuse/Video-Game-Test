export function createHud(actions) {
  const hud = document.createElement('div');
  hud.id = 'hud';
  hud.innerHTML = `
    <section class="hint" id="hint">
      <h1>When the Flowers Fade</h1>
      <p>Click the garden to walk. Drag with the right mouse button, or use the turn buttons, to rotate the view. Scroll to zoom.</p>
      <button type="button" id="dismiss-hint">Hide</button>
    </section>
    <div class="toast" id="toast" role="status"></div>
    <div class="controls" aria-label="Camera">
      <button type="button" id="turn-left" aria-label="Turn view left">↺</button>
      <button type="button" id="turn-right" aria-label="Turn view right">↻</button>
      <button type="button" id="zoom-in" aria-label="Zoom in">+</button>
      <button type="button" id="zoom-out" aria-label="Zoom out">−</button>
    </div>
  `;
  document.body.appendChild(hud);

  hud.querySelector('#dismiss-hint').addEventListener('click', () => {
    hud.querySelector('#hint').remove();
  });
  hud.querySelector('#turn-left').addEventListener('click', () => actions.onRotate(-0.45));
  hud.querySelector('#turn-right').addEventListener('click', () => actions.onRotate(0.45));
  hud.querySelector('#zoom-in').addEventListener('click', () => actions.onZoom(-2.4));
  hud.querySelector('#zoom-out').addEventListener('click', () => actions.onZoom(2.4));

  const toast = hud.querySelector('#toast');
  let remaining = 0;

  function showMessage(text) {
    toast.textContent = text;
    toast.classList.add('show');
    remaining = 4.5;
  }

  function update(dt) {
    if (remaining <= 0) return;
    remaining -= dt;
    if (remaining <= 0) toast.classList.remove('show');
  }

  return { showMessage, update };
}
