export function createDialogueView(actions) {
  const root = document.createElement('section');
  root.id = 'dialogue';
  root.hidden = true;
  root.innerHTML = `
    <p id="dialogue-speaker"></p>
    <p id="dialogue-line"></p>
    <button type="button" id="dialogue-continue">Continue</button>
  `;
  document.body.appendChild(root);
  root.querySelector('#dialogue-continue').addEventListener('click', () => actions.onContinue());

  function show(presentation) {
    root.hidden = false;
    root.querySelector('#dialogue-speaker').textContent = presentation.speaker;
    root.querySelector('#dialogue-line').textContent = presentation.text;
  }

  function hide() {
    root.hidden = true;
  }

  return { show, hide, isOpen: () => !root.hidden };
}
