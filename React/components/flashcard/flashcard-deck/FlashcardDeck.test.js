import React from 'react';
import { shallow } from 'enzyme';
import { FlashcardDeck } from './FlashcardDeck';
import flashcards from 'services/fixtures/unit2Lesson1Flashcards.json';

const _loadFlashcardDeck = jest.fn();
const _incrementFlashcardCurrentIndex = jest.fn();
const _decrementFlashcardCurrentIndex = jest.fn();
const match = {};
const history = {};

const component = (
  <FlashcardDeck
    loadFlashcardDeck={_loadFlashcardDeck}
    incrementFlashcardCurrentIndex={_incrementFlashcardCurrentIndex}
    decrementFlashcardCurrentIndex={_decrementFlashcardCurrentIndex}
    match={match}
    history={history}
    flashcardDeck={flashcards}
    flashcardCurrentIndex={2}
    revealFlashcard={jest.fn()}
    hideFlashcard={jest.fn()}
  />
);
const wrapper = shallow(component);

describe('FlashcardDeck component', () => {
  it('should render and match snapshots', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
