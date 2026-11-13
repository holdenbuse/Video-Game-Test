export function createPointerInput(dom, handlers) {
  let rightDrag = false;
  let leftDown = false;
  let downX = 0;
  let downY = 0;

  dom.addEventListener('contextmenu', (event) => event.preventDefault());

  dom.addEventListener('pointerdown', (event) => {
    if (event.button === 2) {
      rightDrag = true;
      dom.setPointerCapture(event.pointerId);
    }
    if (event.button === 0) {
      leftDown = true;
      downX = event.clientX;
      downY = event.clientY;
    }
  });

  dom.addEventListener('pointerup', (event) => {
    if (event.button === 2) rightDrag = false;
    if (event.button === 0 && leftDown) {
      leftDown = false;
      const dx = event.clientX - downX;
      const dy = event.clientY - downY;
      if (dx * dx + dy * dy <= 25) handlers.onClick(event.clientX, event.clientY);
    }
  });

  dom.addEventListener('pointermove', (event) => {
    if (rightDrag) handlers.onRotate(event.movementX * 0.005);
    else handlers.onHover(event.clientX, event.clientY);
  });

  dom.addEventListener('wheel', (event) => {
    event.preventDefault();
    handlers.onZoom(event.deltaY * 0.008);
  }, { passive: false });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'q' || event.key === 'Q') handlers.onRotate(-0.35);
    if (event.key === 'e' || event.key === 'E') handlers.onRotate(0.35);
    if (event.key === '-' || event.key === '_') handlers.onZoom(2.2);
    if (event.key === '=' || event.key === '+') handlers.onZoom(-2.2);
  });
}
