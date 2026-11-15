export function createStory(events, hooks = {}) {
  const flags = new Set();
  const done = new Set();
  let active = null;
  let page = 0;
  let line = 0;

  function grant(flag) {
    flags.add(flag);
  }

  function has(flag) {
    return flags.has(flag);
  }

  function eventById(id) {
    return events.find((event) => event.id === id) ?? null;
  }

  function available(id) {
    const event = eventById(id);
    if (!event || done.has(event.id)) return false;
    return event.requires.every((flag) => flags.has(flag));
  }

  function start(id) {
    if (active || !available(id)) return { ok: false, presentation: null };
    active = eventById(id);
    page = 0;
    line = 0;
    return { ok: true, presentation: present() };
  }

  function advance() {
    if (!active) return { ok: false, presentation: null };
    if (active.kind === 'book') {
      page += 1;
      if (page >= active.pages.length) return finish();
      return { ok: true, turned: true, presentation: present() };
    }
    line += 1;
    if (line >= active.lines.length) return finish();
    return { ok: true, presentation: present() };
  }

  function finish() {
    const event = active;
    done.add(event.id);
    for (const flag of event.sets) flags.add(flag);
    active = null;
    const scene = event.enterScene ?? null;
    if (scene) hooks.onEnter?.(scene, event.id);
    return { ok: true, finished: true, scene, eventId: event.id, presentation: null };
  }

  function present() {
    if (!active) return null;
    if (active.kind === 'book') {
      const current = active.pages[page];
      return {
        mode: 'book',
        eventId: active.id,
        page,
        pageCount: active.pages.length,
        caption: current.caption,
        plate: current.plate,
        placeholder: true,
        last: page === active.pages.length - 1,
      };
    }
    return {
      mode: 'dialogue',
      eventId: active.id,
      speaker: active.speaker,
      text: active.lines[line],
      line,
      lineCount: active.lines.length,
      placeholder: false,
      last: line === active.lines.length - 1,
    };
  }

  function snapshot() {
    return {
      active: present(),
      flags: [...flags],
      done: [...done],
    };
  }

  return { grant, has, available, start, advance, snapshot };
}
