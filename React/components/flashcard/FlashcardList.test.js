import React from 'react';
import { shallow } from 'enzyme';
import { FlashcardList } from './FlashcardList';

const mockFn = jest.fn();
const flashcardDeck = [
  {
    id: 'BCC-002-01-001',
    cardType: 'B',
    pinyin: 'yī',
    characters: '一',
    english: 'one',
    audioNormal: 'BCC-002-01-001-N',
    audioSlow: 'BCC-002-01-002-S',
  },
  {
    id: 'BCC-002-01-002',
    cardType: 'B',
    pinyin: 'èr',
    characters: '二',
    english: 'two',
    audioNormal: 'BCC-002-01-002-N',
    audioSlow: 'BCC-002-01-003-S',
  },
  {
    id: 'BCC-002-01-003',
    cardType: 'B',
    pinyin: 'sān',
    characters: '三',
    english: 'three',
    audioNormal: 'BCC-002-01-003-N',
    audioSlow: 'BCC-002-01-004-S',
  },
  {
    id: 'BCC-002-01-004',
    cardType: 'B',
    pinyin: 'sì',
    characters: '四',
    english: 'four',
    audioNormal: 'BCC-002-01-004-N',
    audioSlow: 'BCC-002-01-005-S',
  },
  {
    id: 'BCC-002-01-005',
    cardType: 'B',
    pinyin: 'wǔ',
    characters: '五',
    english: 'five',
    audioNormal: 'BCC-002-01-005-N',
    audioSlow: 'BCC-002-01-006-S',
  },
  {
    id: 'BCC-002-01-006',
    cardType: 'B',
    pinyin: 'liù',
    characters: '六',
    english: 'six',
    audioNormal: 'BCC-002-01-006-N',
    audioSlow: 'BCC-002-01-007-S',
  },
  {
    id: 'BCC-002-01-007',
    cardType: 'B',
    pinyin: 'qī',
    characters: '七',
    english: 'seven',
    audioNormal: 'BCC-002-01-007-N',
    audioSlow: 'BCC-002-01-008-S',
  },
  {
    id: 'BCC-002-01-008',
    cardType: 'B',
    pinyin: 'bā',
    characters: '八',
    english: 'eight',
    audioNormal: 'BCC-002-01-008-N',
    audioSlow: 'BCC-002-01-009-S',
  },
  {
    id: 'BCC-002-01-009',
    cardType: 'B',
    pinyin: 'jiǔ',
    characters: '九',
    english: 'nine',
    audioNormal: 'BCC-002-01-009-N',
    audioSlow: 'BCC-002-01-010-S',
  },
  {
    id: 'BCC-002-01-010',
    cardType: 'B',
    pinyin: 'shí',
    characters: '十',
    english: 'ten',
    audioNormal: 'BCC-002-01-010-N',
    audioSlow: 'BCC-002-01-011-S',
  },
  {
    id: 'BCC-002-01-011',
    cardType: 'B',
    pinyin: 'líng',
    characters: '零',
    english: 'zero',
    audioNormal: 'BCC-002-01-011-N',
    audioSlow: 'BCC-002-01-001-S',
  },
];

const firstCardAudioSource =
  'https://cdn.yoyochinese.com/audio/practice/BCC-002-01-001-N.mp3';

const mockMatch = { params: { lessonId: '06' } };

const comp = (
  <FlashcardList
    loadFlashcardDeck={mockFn}
    updateFlashcardAudioSrc={mockFn}
    updateFlashcardItemIsPlaying={mockFn}
    updateFlashcardListIsPlaying={mockFn}
    incrementFlashcardListCurrentIndex={mockFn}
    setFlashcardListCurrentIndex={mockFn}
    resetFlashcardListIndex={mockFn}
    resetFlashcardListIsPlaying={mockFn}
    clearFlashcardSession={mockFn}
    history={{}}
    match={mockMatch}
    flashcardDeck={flashcardDeck}
    flashcardAudioSrc={firstCardAudioSource}
  />
);
const shallowComp = shallow(comp);

describe('FlashcardList Component', () => {
  it('should match a snapshot', () => {
    expect(shallowComp).toMatchSnapshot();
  });

  it('should render audio with given source', () => {
    expect(shallowComp.find('audio').html()).toContain(firstCardAudioSource);
  });

  describe('Footer tests:', () => {
    const footer = shallowComp.find('footer');

    it('should render a footer with the expected class', () => {
      expect(footer.hasClass('footer-button-container')).toEqual(true);
    });

    it('should contain a neutral signal button', () => {
      expect(footer.find('SignalButton').html()).toContain('button neutral');
    });

    it('should contain a PlayAllButton', () => {
      expect(footer.find('PlayAllButton').html()).toContain('button play-icon');
    });
  });
});
