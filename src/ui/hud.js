export function createHud(actions) {
  const hud = document.createElement('div');
  hud.id = 'hud';
  hud.innerHTML = `
    <section class="hint" id="hint">
      <h1>When the Flowers Fade</h1>
      <p>Click the garden to walk. The view stays on Orin until you move it. Drag with the left mouse button, or use the pad, to move the view. Drag with the right button to turn it. Scroll to zoom. The Orin button sticks the view back.</p>
      <button type="button" id="dismiss-hint">Hide</button>
    </section>
    <div class="toast" id="toast" role="status"></div>
    <div class="controls" aria-label="Camera">
      <div class="pad" aria-label="Move view">
        <span></span>
        <button type="button" id="pan-up" aria-label="Move view forward">↑</button>
        <span></span>
        <button type="button" id="pan-left" aria-label="Move view left">←</button>
        <button type="button" id="center-view" aria-label="Center view on Orin">Orin</button>
        <button type="button" id="pan-right" aria-label="Move view right">→</button>
        <span></span>
        <button type="button" id="pan-down" aria-label="Move view back">↓</button>
        <span></span>
      </div>
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
  const step = 2.6;
  hud.querySelector('#pan-up').addEventListener('click', () => actions.onPan(0, step));
  hud.querySelector('#pan-down').addEventListener('click', () => actions.onPan(0, -step));
  hud.querySelector('#pan-left').addEventListener('click', () => actions.onPan(-step, 0));
  hud.querySelector('#pan-right').addEventListener('click', () => actions.onPan(step, 0));
  hud.querySelector('#center-view').addEventListener('click', () => actions.onRecenter());
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
