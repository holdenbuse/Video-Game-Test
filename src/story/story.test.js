import assert from 'node:assert/strict';
import test from 'node:test';
import { ACADEMY_HEAD } from '../data/academyHead.js';
import { CHAPTER_EVENTS } from '../data/chapter01Events.js';
import { AGENT_RADIUS, GARDEN } from '../data/gardenLayout.js';
import { createNavGrid, rasterizeBlocks } from '../movement/navGrid.js';
import { createStory } from './story.js';

const CONTROL_WORDS = /click|attack|puzzle|button|zoom|drag|cooldown|action point/i;

test('story events are data and do not start the next event themselves', () => {
  const entered = [];
  const story = createStory(CHAPTER_EVENTS, {
    onEnter: (scene) => entered.push(scene),
  });
  assert.deepEqual(CHAPTER_EVENTS.map((event) => event.order), [1, 2, 3, 4]);
  assert.equal(story.start('invitation').ok, false);
  assert.equal(story.start('time-jump').ok, false);
  assert.equal(story.start('chapter-ending').ok, false);

  assert.equal(story.start('opening-book').ok, true);
  let result = { finished: false };
  while (!result.finished) result = story.advance();
  assert.equal(result.scene, 'garden');
  assert.deepEqual(entered, ['garden']);
  assert.equal(story.available('invitation'), false);
  assert.equal(story.available('opening-book'), false);
});

test('book pages are narration and the three book events enter their scenes', () => {
  const entered = [];
  const story = createStory(CHAPTER_EVENTS, {
    onEnter: (scene) => entered.push(scene),
  });
  const opening = story.start('opening-book');
  assert.equal(opening.presentation.mode, 'book');
  assert.equal(opening.presentation.placeholder, true);
  const captions = [opening.presentation.caption];
  let result = story.advance();
  while (!result.finished) {
    captions.push(result.presentation.caption);
    assert.equal(result.presentation.mode, 'book');
    result = story.advance();
  }
  for (const caption of captions) assert.doesNotMatch(caption, CONTROL_WORDS);
  assert.match(captions.join(' '), /not named/);

  story.grant('boss-defeated');
  story.grant('invitation-done');
  playBook(story, 'time-jump');
  story.grant('aftermath-done');
  playBook(story, 'chapter-ending');
  assert.deepEqual(entered, ['garden', 'academy', 'chapter-2']);
});

test('the invitation is spoken in the world and leaves the open questions open', () => {
  const story = createStory(CHAPTER_EVENTS);
  story.grant('boss-defeated');
  const started = story.start('invitation');
  assert.equal(started.presentation.mode, 'dialogue');
  assert.equal(started.presentation.speaker, 'Academy head');
  const lines = [started.presentation.text];
  let result = story.advance();
  while (!result.finished) {
    assert.equal(result.presentation.mode, 'dialogue');
    lines.push(result.presentation.text);
    result = story.advance();
  }
  const spoken = lines.join(' ');
  assert.match(spoken, /invite you to attend/);
  assert.doesNotMatch(spoken, /mother|father|parent|leader|click|puzzle/i);
  assert.equal(story.has('invitation-done'), true);
  assert.equal(result.scene, null);
  assert.equal(story.start('invitation').ok, false);
});

test('the academy head stands on open garden ground', () => {
  const nav = createNavGrid(GARDEN);
  rasterizeBlocks(nav, GARDEN.blocks, AGENT_RADIUS);
  assert.equal(nav.isWalkable(ACADEMY_HEAD.x, ACADEMY_HEAD.z), true);
  const path = nav.findPath(GARDEN.start.x, GARDEN.start.z, ACADEMY_HEAD.x, ACADEMY_HEAD.z);
  assert.equal(path.status, 'ok');
});

function playBook(story, id) {
  assert.equal(story.start(id).ok, true);
  let result = { finished: false };
  while (!result.finished) result = story.advance();
  return result;
}
