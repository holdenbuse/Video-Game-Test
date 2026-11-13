export function createCombatHud(actions) {
  const root = document.createElement('div');
  root.id = 'combat-hud';
  root.hidden = true;
  root.innerHTML = `
    <section class="combat-panel" id="combat-panel" hidden>
      <p id="combat-panel-text"></p>
      <button type="button" id="tutorial-continue">Continue</button>
      <button type="button" id="begin-practice">Begin</button>
      <button type="button" id="retry-practice">Try again</button>
      <button type="button" id="return-garden">Return to the garden</button>
    </section>
    <section class="turn-order" id="turn-order" hidden aria-label="Initiative"></section>
    <section class="combat-bar" id="combat-bar" hidden aria-label="Combat actions">
      <div class="ap" id="ap-pips" aria-label="Action points"></div>
      <button type="button" id="ability-basic-attack">Basic attack</button>
      <button type="button" id="ability-bloom-shield">Bloom Shield</button>
      <button type="button" id="confirm-move" hidden>Move</button>
      <button type="button" id="end-turn">End turn</button>
    </section>
  `;
  document.body.appendChild(root);

  root.querySelector('#tutorial-continue').addEventListener('click', () => actions.onContinue());
  root.querySelector('#begin-practice').addEventListener('click', () => actions.onBegin());
  root.querySelector('#retry-practice').addEventListener('click', () => actions.onRetry());
  root.querySelector('#return-garden').addEventListener('click', () => actions.onLeave());
  root.querySelector('#ability-basic-attack').addEventListener('click', () => actions.onAbility('basic-attack'));
  root.querySelector('#ability-bloom-shield').addEventListener('click', () => actions.onAbility('bloom-shield'));
  root.querySelector('#confirm-move').addEventListener('click', () => actions.onConfirmMove());
  root.querySelector('#end-turn').addEventListener('click', () => actions.onEndTurn());

  function render(snapshot) {
    const fighting = snapshot.phase === 'fighting';
    const showing = snapshot.phase !== 'exploring';
    root.hidden = !showing;
    const hint = document.querySelector('#hint');
    if (hint) hint.hidden = showing;
    const panel = root.querySelector('#combat-panel');
    const text = root.querySelector('#combat-panel-text');
    const continueButton = root.querySelector('#tutorial-continue');
    const beginButton = root.querySelector('#begin-practice');
    const retryButton = root.querySelector('#retry-practice');
    const returnButton = root.querySelector('#return-garden');
    panel.hidden = !(snapshot.armText || snapshot.tutorial || snapshot.outcome);
    text.textContent = snapshot.armText || snapshot.tutorial?.text || snapshot.outcome || '';
    continueButton.hidden = !snapshot.tutorial?.canContinue;
    beginButton.hidden = snapshot.phase !== 'armed';
    retryButton.hidden = snapshot.phase !== 'defeat';
    returnButton.hidden = snapshot.phase !== 'victory';
    continueButton.classList.toggle('highlight', snapshot.tutorial?.highlight === 'continue');

    const order = root.querySelector('#turn-order');
    order.hidden = !fighting;
    order.classList.toggle('highlight', snapshot.tutorial?.highlight === 'initiative');
    order.innerHTML = snapshot.fighters.map((fighter) => `
      <article class="${fighter.active ? 'active' : ''}">
        <strong>${fighter.name}</strong>
        <span>${fighter.hp}/${fighter.maxHp}</span>
        ${fighter.shield > 0 ? `<em>Shield ${fighter.shield}</em>` : ''}
      </article>
    `).join('');

    const bar = root.querySelector('#combat-bar');
    bar.hidden = !fighting;
    const orin = snapshot.fighters.find((fighter) => fighter.id === 'orin');
    const pips = root.querySelector('#ap-pips');
    pips.classList.toggle('highlight', snapshot.tutorial?.highlight === 'ap');
    pips.innerHTML = Array.from({ length: 4 }, (_, index) => (
      `<i class="${orin && index < orin.ap ? 'full' : ''}"></i>`
    )).join('');

    for (const id of ['basic-attack', 'bloom-shield']) {
      const button = root.querySelector(`#ability-${id}`);
      const ability = snapshot.abilities.find((entry) => entry.id === id);
      button.disabled = !ability || !ability.ready;
      button.classList.toggle('selected', snapshot.selectedAbility === id);
      button.classList.toggle('highlight', snapshot.tutorial?.highlight === id);
      if (!ability) button.textContent = id;
      else if (ability.cooldown > 0) button.textContent = `${ability.name} · ${ability.cooldown}`;
      else button.textContent = `${ability.name} · ${ability.ap} AP`;
    }

    const confirm = root.querySelector('#confirm-move');
    confirm.hidden = !snapshot.preview;
    confirm.classList.toggle('highlight', snapshot.tutorial?.highlight === 'ground' && snapshot.preview);
    if (snapshot.preview) {
      confirm.textContent = snapshot.preview.ap === 0 ? 'Move · free' : `Move · ${snapshot.preview.ap} AP`;
    }
    const end = root.querySelector('#end-turn');
    end.classList.toggle('highlight', snapshot.tutorial?.highlight === 'end-turn');
  }

  return { render };
}
