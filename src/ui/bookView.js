const PLATES = {
  book: `
    <svg viewBox="0 0 240 180" role="img" aria-label="Placeholder illustration of an open book">
      <rect width="240" height="180" fill="#f3e2c4"/>
      <path d="M28 28h80c8 18 8 104 0 124H28z" fill="#fffaf1" stroke="#8a6238" stroke-width="3"/>
      <path d="M212 28H132c-8 18-8 104 0 124h80z" fill="#fffaf1" stroke="#8a6238" stroke-width="3"/>
      <path d="M118 36v112" stroke="#c46a2f" stroke-width="4"/>
      <path d="M48 62h48M48 78h40M48 94h44" stroke="#d7b48a" stroke-width="3"/>
      <circle cx="164" cy="92" r="16" fill="#ffb4c4"/>
      <text x="120" y="168" text-anchor="middle" font-size="11" fill="#8a6238">Placeholder illustration</text>
    </svg>
  `,
  flowers: `
    <svg viewBox="0 0 240 180" role="img" aria-label="Placeholder illustration of flowers">
      <rect width="240" height="180" fill="#d7efc4"/>
      <circle cx="78" cy="92" r="18" fill="#ff6b8a"/>
      <circle cx="120" cy="74" r="18" fill="#ffd166"/>
      <circle cx="162" cy="96" r="18" fill="#c77dff"/>
      <path d="M78 110v34M120 92v52M162 114v30" stroke="#2f7a45" stroke-width="4"/>
      <text x="120" y="168" text-anchor="middle" font-size="11" fill="#2f6b3a">Placeholder illustration</text>
    </svg>
  `,
  garden: `
    <svg viewBox="0 0 240 180" role="img" aria-label="Placeholder illustration of a garden">
      <rect width="240" height="180" fill="#b7dd8d"/>
      <rect x="36" y="28" width="168" height="112" fill="none" stroke="#2f6b3a" stroke-width="8"/>
      <path d="M120 28v112M36 84h168" stroke="#efe4c4" stroke-width="10"/>
      <circle cx="120" cy="84" r="16" fill="#8fd0e8"/>
      <text x="120" y="168" text-anchor="middle" font-size="11" fill="#2f6b3a">Placeholder illustration</text>
    </svg>
  `,
  years: `
    <svg viewBox="0 0 240 180" role="img" aria-label="Placeholder illustration of turning pages">
      <rect width="240" height="180" fill="#f3e2c4"/>
      <rect x="58" y="46" width="92" height="78" fill="#fffaf1" stroke="#8a6238" stroke-width="3" transform="rotate(-8 104 85)"/>
      <rect x="78" y="40" width="92" height="78" fill="#fffaf1" stroke="#8a6238" stroke-width="3"/>
      <rect x="98" y="34" width="92" height="78" fill="#fffaf1" stroke="#c46a2f" stroke-width="3" transform="rotate(7 144 73)"/>
      <text x="120" y="168" text-anchor="middle" font-size="11" fill="#8a6238">Placeholder illustration</text>
    </svg>
  `,
};

export function createBookView(actions) {
  const root = document.createElement('div');
  root.id = 'book';
  root.hidden = true;
  root.innerHTML = `
    <div class="book-spread">
      <div class="book-plate" id="book-plate"></div>
      <div class="book-page" id="book-page">
        <p id="book-kicker"></p>
        <p id="book-caption"></p>
        <button type="button" id="turn-page">Turn page</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);
  let turning = false;

  root.querySelector('#turn-page').addEventListener('click', () => {
    if (turning || root.hidden) return;
    turning = true;
    root.classList.add('is-turning');
    window.setTimeout(() => {
      root.classList.remove('is-turning');
      turning = false;
      actions.onTurn();
    }, 480);
  });

  function show(presentation) {
    root.hidden = false;
    root.querySelector('#book-plate').innerHTML = PLATES[presentation.plate] ?? PLATES.book;
    root.querySelector('#book-kicker').textContent = `Page ${presentation.page + 1} of ${presentation.pageCount}`;
    root.querySelector('#book-caption').textContent = presentation.caption;
  }

  function hide() {
    root.hidden = true;
    root.classList.remove('is-turning');
    turning = false;
  }

  return { show, hide };
}
