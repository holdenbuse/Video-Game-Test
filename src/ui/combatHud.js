export function createCombatHud(actions) {
  const root = document.createElement('div');
  root.id = 'combat-hud';
  root.hidden = true;
  root.innerHTML = `
    <section class="combat-panel" id="combat-panel" hidden>
      <p id="combat-step"></p>
      <h2 id="combat-title"></h2>
      <p id="combat-panel-text"></p>
      <p id="combat-action"></p>
      <button type="button" id="tutorial-continue">Continue</button>
      <button type="button" id="begin-practice">Begin</button>
      <button type="button" id="restore-checkpoint">Restore checkpoint</button>
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
  root.querySelector('#restore-checkpoint').addEventListener('click', () => actions.onRestore());
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
    const restoreButton = root.querySelector('#restore-checkpoint');
    const retryButton = root.querySelector('#retry-practice');
    const returnButton = root.querySelector('#return-garden');
    panel.hidden = !(snapshot.armText || snapshot.tutorial || snapshot.outcome || snapshot.telegraph);
    const stepLabel = root.querySelector('#combat-step');
    const title = root.querySelector('#combat-title');
    const action = root.querySelector('#combat-action');
    if (snapshot.tutorial) {
      stepLabel.hidden = false;
      stepLabel.textContent = `Step ${snapshot.tutorial.stepNumber} of ${snapshot.tutorial.stepCount}`;
      title.textContent = snapshot.tutorial.title;
      text.textContent = snapshot.tutorial.text;
      action.hidden = false;
      action.textContent = snapshot.tutorial.id === 'move' && snapshot.preview
        ? 'Now click the highlighted Move button.'
        : snapshot.tutorial.action;
    } else if (snapshot.armText) {
      stepLabel.hidden = true;
      title.textContent = snapshot.kind === 'boss'
        ? 'The garden boss is selected'
        : snapshot.kind === 'standard'
          ? 'A standard fight is starting'
          : 'A practice fight is starting';
      text.textContent = snapshot.armText;
      action.hidden = false;
      action.textContent = 'Click Begin.';
    } else if (snapshot.telegraph) {
      stepLabel.hidden = true;
      title.textContent = snapshot.telegraph.name;
      text.textContent = snapshot.telegraph.text;
      action.hidden = false;
      action.textContent = snapshot.telegraph.action;
    } else if (snapshot.outcome) {
      stepLabel.hidden = true;
      title.textContent = outcomeTitle(snapshot);
      text.textContent = snapshot.outcome;
      action.hidden = false;
      action.textContent = outcomeAction(snapshot);
    } else {
      stepLabel.hidden = true;
      title.textContent = '';
      text.textContent = '';
      action.hidden = true;
    }
    continueButton.hidden = !snapshot.tutorial?.canContinue;
    beginButton.hidden = snapshot.phase !== 'armed';
    restoreButton.hidden = snapshot.phase !== 'defeat' || !snapshot.boss?.checkpoint;
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
        ${fighter.team === 'enemy' && snapshot.boss ? bossPool(snapshot, fighter) : ''}
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

function outcomeTitle(snapshot) {
  if (snapshot.phase === 'victory') {
    if (snapshot.kind === 'boss') return 'The boss withdraws';
    if (snapshot.kind === 'standard') return 'The fight is finished';
    return 'The practice is over';
  }
  if (snapshot.boss?.checkpoint) return 'Phase 2 is stored';
  if (snapshot.kind === 'boss') return 'The boss fight ends';
  if (snapshot.kind === 'standard') return 'The fight ends';
  return 'Try the practice again';
}

function outcomeAction(snapshot) {
  if (snapshot.phase === 'victory') return 'Click Return to the garden.';
  if (snapshot.boss?.checkpoint) {
    return 'Click Restore checkpoint to return to the moment phase 2 started. Click Try again to restart the fight.';
  }
  return 'Click Try again.';
}

function bossPool(snapshot, fighter) {
  const ratio = fighter.maxHp > 0 ? Math.max(0, fighter.hp / fighter.maxHp) : 0;
  const marks = snapshot.boss.divisions.map((division) => (
    `<b style="left:${division * 100}%"></b>`
  )).join('');
  return `
    <small>Phase ${snapshot.boss.phase} of ${snapshot.boss.phaseCount} · one health pool</small>
    <div class="phase-pool" aria-hidden="true"><i style="width:${ratio * 100}%"></i>${marks}</div>
  `;
}
