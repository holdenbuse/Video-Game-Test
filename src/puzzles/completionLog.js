// Session record of one-time puzzle rewards.
// A later save system can persist this set. Refreshing the page clears it.

export function createCompletionLog() {
  const rewarded = new Set();

  function claim(id) {
    if (rewarded.has(id)) return false;
    rewarded.add(id);
    return true;
  }

  function has(id) {
    return rewarded.has(id);
  }

  return { claim, has };
}
