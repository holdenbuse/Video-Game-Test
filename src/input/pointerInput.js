export function createPointerInput(dom, handlers) {
  let rightDrag = false;
  let middleDrag = false;
  let leftDown = false;
  let leftDrag = false;
  let downX = 0;
  let downY = 0;
  const held = new Set();

  dom.addEventListener('contextmenu', (event) => event.preventDefault());
  dom.addEventListener('auxclick', (event) => event.preventDefault());

  dom.addEventListener('pointerdown', (event) => {
    if (event.button === 2) {
      rightDrag = true;
      dom.setPointerCapture(event.pointerId);
    }
    if (event.button === 1) {
      middleDrag = true;
      event.preventDefault();
      dom.setPointerCapture(event.pointerId);
      dom.style.cursor = 'grabbing';
    }
    if (event.button === 0) {
      leftDown = true;
      leftDrag = false;
      downX = event.clientX;
      downY = event.clientY;
    }
  });

  dom.addEventListener('pointerup', (event) => {
    if (event.button === 2) rightDrag = false;
    if (event.button === 1) {
      middleDrag = false;
      dom.style.cursor = 'default';
    }
    if (event.button === 0 && leftDown) {
      leftDown = false;
      const dragged = leftDrag;
      leftDrag = false;
      if (!dragged) handlers.onClick(event.clientX, event.clientY);
      else dom.style.cursor = 'default';
    }
  });

  dom.addEventListener('pointermove', (event) => {
    if (middleDrag || leftDrag) {
      handlers.onPan(event.movementX, event.movementY);
      return;
    }
    if (leftDown) {
      const dx = event.clientX - downX;
      const dy = event.clientY - downY;
      if (dx * dx + dy * dy > 25) {
        leftDrag = true;
        dom.style.cursor = 'grabbing';
        handlers.onPan(event.movementX, event.movementY);
        return;
      }
    }
    if (rightDrag) handlers.onRotate(event.movementX * 0.005);
    else handlers.onHover(event.clientX, event.clientY);
  });

  dom.addEventListener('wheel', (event) => {
    event.preventDefault();
    handlers.onZoom(event.deltaY * 0.008);
  }, { passive: false });

  window.addEventListener('keydown', (event) => {
    if (event.key.startsWith('Arrow') || event.key === ' ') event.preventDefault();
    held.add(event.key);
    if (event.repeat) return;
    if (event.key === 'q' || event.key === 'Q') handlers.onRotate(-0.35);
    if (event.key === 'e' || event.key === 'E') handlers.onRotate(0.35);
    if (event.key === '-' || event.key === '_') handlers.onZoom(2.2);
    if (event.key === '=' || event.key === '+') handlers.onZoom(-2.2);
    if (event.key === 'c' || event.key === 'C' || event.key === 'Home') handlers.onRecenter();
  });

  window.addEventListener('keyup', (event) => {
    held.delete(event.key);
  });

  window.addEventListener('blur', () => held.clear());

  function panAxes() {
    let x = 0;
    let y = 0;
    if (held.has('ArrowLeft')) x -= 1;
    if (held.has('ArrowRight')) x += 1;
    if (held.has('ArrowUp')) y += 1;
    if (held.has('ArrowDown')) y -= 1;
    return { x, y };
  }

  return { panAxes };
}
