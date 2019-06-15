/* eslint-disable no-console */
import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

// REDUX CONNECTIONS
import { connect } from 'react-redux';
import {
  getFlashcardDeck,
  getFlashcardCurrentIndex,
  getFlashcardIsRevealed,
} from 'selectors/flashcardSelectors';
import {
  _loadFlashcardDeck,
  _incrementFlashcardCurrentIndex,
  _decrementFlashcardCurrentIndex,
  _revealFlashcard,
  _hideFlashcard,
  _clearFlashcardSession,
} from 'actions/flashcardActions';

// 3RD PARTY LIBS
import { MdChevronLeft as BackArrow } from 'react-icons/md';
import { IoMdClose as Close } from 'react-icons/io';

// PROJECT COMPONENTS
import PageHeader, {
  Themes as HeaderThemes,
} from 'components/page-header/PageHeader';
import PageHeaderButton, {
  Themes as ButtonThemes,
  Positions,
} from 'components/page-header/page-header-button/PageHeaderButton';
import PageHeaderTitle from 'components/page-header/page-header-title/PageHeaderTitle';
import ProgressBar from 'components/shared/progress-bar/ProgressBar';
import SignalButton from 'components/shared/UI/signal-button/SignalButton';
import BackdropPanel from 'components/shared/backdrop-panel/BackdropPanel';
import { QuizIcon } from 'components/practice/Practice';
import BackArrowButton from 'components/shared/UI/arrow-buttons/BackArrowButton';
import FlashcardBasic from 'components/practice/flashcard/flashcard-types/FlashcardBasic';

// MISC...
import { routes } from 'routes/routes';
import styles from './FlashcardDeck.scss';

export class FlashcardDeck extends PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    loadFlashcardDeck: PropTypes.func.isRequired,
    incrementFlashcardCurrentIndex: PropTypes.func.isRequired,
    decrementFlashcardCurrentIndex: PropTypes.func.isRequired,
    revealFlashcard: PropTypes.func,
    hideFlashcard: PropTypes.func,
    clearFlashcardSession: PropTypes.func,
    flashcardDeck: PropTypes.array,
    flashcardCurrentIndex: PropTypes.number,
    isFlashcardRevealed: PropTypes.bool,
  };

  async componentDidMount() {
    const { match, loadFlashcardDeck } = this.props;
    const { lessonId } = match.params || '';
    loadFlashcardDeck(lessonId);
  }

  componentWillUnmount() {
    const { clearFlashcardSession } = this.props;
    clearFlashcardSession();
  }

  handleSelectPracticeAudioSpeed = setting => {
    this.setState({ isPracticeAudioSpeedRegular: setting });
  };

  handleNextClick = () => {
    const {
      incrementFlashcardCurrentIndex,
      flashcardCurrentIndex,
      flashcardDeck,
      hideFlashcard,
    } = this.props;
    hideFlashcard();
    incrementFlashcardCurrentIndex(flashcardCurrentIndex, flashcardDeck.length);
  };

  handlePreviousCardClick = () => {
    const {
      decrementFlashcardCurrentIndex,
      flashcardCurrentIndex,
      hideFlashcard,
    } = this.props;

    hideFlashcard();
    decrementFlashcardCurrentIndex(flashcardCurrentIndex);
  };

  handleRevealClick = () => {
    const { revealFlashcard } = this.props;
    revealFlashcard();
  };

  handleExitClicked = () => {
    const { lessonId } = this.props.match.params;
    return this.props.history.push(routes.PRACTICE.linkTo(lessonId));
  };

  handleQuizClicked = () => {
    const { lessonId } = this.props.match.params;
    return this.props.history.push(routes.QUIZ.linkTo(lessonId));
  };

  render() {
    const {
      flashcardDeck,
      flashcardCurrentIndex,
      isFlashcardRevealed,
    } = this.props;

    if (!flashcardDeck) return null;
    const deckItem = flashcardDeck[flashcardCurrentIndex];
    if (!deckItem) return null; // ideally we shouldn't be able to have an invalid deck index... can we?

    const isLastCard = flashcardCurrentIndex === flashcardDeck.length - 1;

    const headerText = isLastCard
      ? 'Final Card'
      : `Flashcards ${flashcardCurrentIndex + 1}/${flashcardDeck.length}`;

    let footerButton = null;
    if (isFlashcardRevealed) {
      if (isLastCard) {
        footerButton = (
          <SignalButton click={this.handleQuizClicked} buttonType="neutral">
            <>Start Quiz</>
          </SignalButton>
        );
      } else {
        footerButton = (
          <SignalButton click={this.handleNextClick} buttonType="neutral">
            <>Next</>
          </SignalButton>
        );
      }
    } else {
      footerButton = (
        <SignalButton click={this.handleRevealClick} buttonType="neutral">
          <>Reveal</>
        </SignalButton>
      );
    }

    return (
      <section className={styles.FlashcardDeck}>
        <PageHeader theme={HeaderThemes.BEGINNER}>
          <Fragment>
            <PageHeaderButton
              theme={ButtonThemes.LIGHT}
              Icon={Close}
              click={this.handleExitClicked}
              position={Positions.LEFT}
            />
            <PageHeaderTitle headerText={headerText} />
            <PageHeaderButton
              click={this.handleQuizClicked}
              theme={ButtonThemes.LIGHT}
              Icon={QuizIcon}
              position={Positions.RIGHT}
            />
          </Fragment>
        </PageHeader>
        <ProgressBar
          status={flashcardCurrentIndex + 1}
          length={flashcardDeck.length}
        />
        <main className="quiz-container">
          <BackdropPanel hasPadding={false}>
            {deckItem && <FlashcardBasic deckItem={deckItem} />}
          </BackdropPanel>
        </main>
        <footer className="footer-buttons-container">
          <BackArrowButton
            Icon={BackArrow}
            click={this.handlePreviousCardClick}
          />
          {footerButton}
        </footer>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  flashcardDeck: getFlashcardDeck(state),
  flashcardCurrentIndex: getFlashcardCurrentIndex(state),
  isFlashcardRevealed: getFlashcardIsRevealed(state),
});

const mapDispatchToProps = dispatch => ({
  loadFlashcardDeck: lessonId => dispatch(_loadFlashcardDeck(lessonId)),
  incrementFlashcardCurrentIndex: (flashcardCurrentIndex, deckLength) =>
    dispatch(
      _incrementFlashcardCurrentIndex(flashcardCurrentIndex, deckLength)
    ),
  decrementFlashcardCurrentIndex: flashcardCurrentIndex =>
    dispatch(_decrementFlashcardCurrentIndex(flashcardCurrentIndex)),
  revealFlashcard: () => dispatch(_revealFlashcard()),
  hideFlashcard: () => dispatch(_hideFlashcard()),
  clearFlashcardSession: () => dispatch(_clearFlashcardSession()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashcardDeck);
