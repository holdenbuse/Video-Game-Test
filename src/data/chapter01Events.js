// Chapter 1 story events. Order and requirements are data.
// Captions restate sequences already written in CHAPTER_01.md.
// They do not teach controls, name the narrator, or add a scene.

export const CHAPTER_EVENTS = [
  {
    id: 'opening-book',
    kind: 'book',
    order: 1,
    requires: [],
    sets: ['opening-seen'],
    enterScene: 'garden',
    pages: [
      {
        plate: 'book',
        caption: 'A narrator opens an old illustrated book. The narrator is not named.',
      },
      {
        plate: 'flowers',
        caption: 'The pages tell of Orin, about eleven, in a world where magic is common.',
      },
      {
        plate: 'garden',
        caption: 'The page turns to the garden of the family estate.',
      },
    ],
  },
  {
    id: 'invitation',
    kind: 'dialogue',
    order: 2,
    requires: ['boss-defeated'],
    sets: ['invitation-done'],
    speaker: 'Academy head',
    lines: [
      'I am the head of the academy.',
      'I came to the estate to invite you to attend.',
    ],
  },
  {
    id: 'time-jump',
    kind: 'book',
    order: 3,
    requires: ['invitation-done'],
    sets: ['time-jumped'],
    enterScene: 'academy',
    pages: [
      {
        plate: 'years',
        caption: 'The narrator moves the story forward several years. Orin is now about nineteen.',
      },
      {
        plate: 'book',
        caption: 'The next pages wait at the academy.',
      },
    ],
  },
  {
    id: 'chapter-ending',
    kind: 'book',
    order: 4,
    requires: ['aftermath-done'],
    sets: ['chapter-1-ended'],
    enterScene: 'chapter-2',
    pages: [
      {
        plate: 'book',
        caption: 'The book returns. The narrator advances the story into Chapter 2.',
      },
    ],
  },
];
