import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { MdStar as Star } from 'react-icons/md';

import PracticeList from 'components/practice/practice-list/PracticeList';
import SignalButton from 'components/shared/UI/signal-button/SignalButton';
import styles from './FlashcardList.scss';
import PlayAllButton from 'components/shared/UI/play-all-button/PlayAllButton';
import SVGIcon from 'components/shared/UI/icons/SVGIcon';
import { flashcardsD, flashcardsViewBox } from 'components/shared/UI/icons/SVGcoordinates';
import { routes } from 'routes/routes';

import { createFlashcardAudioUrl } from 'services/helpers/contentUrlGenerators';

// REDUX CONNECTIONS
import { connect } from 'react-redux';

import {
  getFlashcardDeck,
  getFlashcardItemIsPlaying,
  getFlashcardAudioSrc,
  getFlashcardListIsPlaying,
  getFlashcardListCurrentIndex,
} from 'selectors/flashcardSelectors';

import { getPracticeAudioSpeed } from 'selectors/practiceSelectors';

import {
  _loadFlashcardDeck,
  _updateFlashcardAudioSrc,
  _updateFlashcardItemIsPlaying,
  _clearFlashcardSession,
  _updateFlashcardListIsPlaying,
  _incrementFlashcardListCurrentIndex,
  _setFlashcardListCurrentIndex,
  _resetFlashcardListIndex,
  _resetFlashcardListIsPlaying,
} from 'actions/flashcardActions';

export class FlashcardList extends PureComponent {
  player = React.createRef();

  static propTypes = {
    loadFlashcardDeck: PropTypes.func.isRequired,
    updateFlashcardAudioSrc: PropTypes.func.isRequired,
    updateFlashcardItemIsPlaying: PropTypes.func.isRequired,
    updateFlashcardListIsPlaying: PropTypes.func.isRequired,
    incrementFlashcardListCurrentIndex: PropTypes.func.isRequired,
    setFlashcardListCurrentIndex: PropTypes.func.isRequired,
    resetFlashcardListIndex: PropTypes.func.isRequired,
    resetFlashcardListIsPlaying: PropTypes.func.isRequired,
    clearFlashcardSession: PropTypes.func.isRequired,
    flashcardDeck: PropTypes.array,
    flashcardItemIsPlaying: PropTypes.bool,
    flashcardListIsPlaying: PropTypes.bool,
    flashcardAudioSrc: PropTypes.string,
    flashcardListCurrentIndex: PropTypes.number,
    practiceAudioSpeed: PropTypes.number,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { match, loadFlashcardDeck } = this.props;
    const { lessonId } = match.params;
    loadFlashcardDeck(lessonId);
  }

  // add event listeners to audio player for audio play and audio end events
  initPlayer = () => {
    const player = this.player.current;

    player.onended = this.onFlashcardAudioEnded;
    player.onplay = this.onFlashcardAudioPlayed;
  };

  componentDidUpdate(prevProps) {
    // if the player exists and the list has loaded for the first time, add event listeners on the audio element using initPlayer
    if (prevProps.flashcardDeck === null && this.props.flashcardDeck !== null)
      this.initPlayer();

    // if the user clicks play/pause all icon when the the store says the list is not currently playing, play the one item
    if (
      prevProps.flashcardListIsPlaying === false &&
      this.props.flashcardListIsPlaying === true
    ) {
      this.flashcardListPlayItem();
    }

    // if the full list is still playing and the playback of a single item has ended, trigger the playing of the next item in the list
    if (
      prevProps.flashcardItemIsPlaying === true &&
      this.props.flashcardItemIsPlaying === false &&
      this.props.flashcardListIsPlaying === true
    ) {
      this.flashcardListPlayNext();
    }

    // if the user clicks play/pause all icon when the the store says the list is currently playing, pause the item currently being played
    if (
      prevProps.flashcardListIsPlaying === true &&
      this.props.flashcardListIsPlaying === false
    ) {
      this.pauseAudio();
    }

    // if the the user clicks an individual item while play all is happening, the list playback will stop, reset, and item is playing will be set to true, resulting in these conditions being met, and when this happens play the individual list item
    if (
      prevProps.flashcardListIsPlaying === true &&
      this.props.flashcardListIsPlaying === false &&
      this.props.flashcardItemIsPlaying === true
    ) {
      this.handleListItemClicked();
    }

    // if the user changes the audio speed setting while an item is playing, update the audio speed immediately
    if (prevProps.practiceAudioSpeed !== this.props.practiceAudioSpeed) {
      this.player.current.playbackRate = this.props.practiceAudioSpeed;
    }
  }

  componentWillUnmount() {
    const { clearFlashcardSession } = this.props;
    clearFlashcardSession();
  }

  // helper functions

  // general helper function to initiate item playback at the proper speed from the proper audio source
  playAudio = async audioNormal => {
    const player = this.player.current;
    const { updateFlashcardAudioSrc, practiceAudioSpeed } = this.props;

    await updateFlashcardAudioSrc(`${audioNormal}.mp3`);
    player.playbackRate = practiceAudioSpeed;
    player.play();
  };

  // general helper function to pause item playback
  pauseAudio = () => {
    const player = this.player.current;

    player.pause();
  };

  // general helper function to increment the index of the item being played during play all and also to check if the item is the last in the list
  incrementIndex = () => {
    const {
      flashcardDeck,
      flashcardListCurrentIndex,
      incrementFlashcardListCurrentIndex,
    } = this.props;

    incrementFlashcardListCurrentIndex({
      index: flashcardListCurrentIndex,
      deckLength: flashcardDeck.length,
    });
  };

  // methods for playing individual flashcard items on click

  // click event handler for playing individual list item
  handleListItemClicked = async (audioNormal, index) => {
    const player = this.player.current;

    const {
      resetFlashcardListIsPlaying,
      setFlashcardListCurrentIndex,
      flashcardListIsPlaying,
      flashcardItemIsPlaying,
      updateFlashcardItemIsPlaying,
      flashcardAudioSrc,
      flashcardDeck,
    } = this.props;

    // if an individual item is clicked while play all is not active and the item is already playing, pause the item
    if (flashcardListIsPlaying === false && flashcardItemIsPlaying === true) {
      this.pauseAudio();
      updateFlashcardItemIsPlaying(false);
    }
    // if an individual item is clicked while play all is not active and the item is not playing, play the item
    else if (!flashcardListIsPlaying && !flashcardItemIsPlaying) {
      if (
        createFlashcardAudioUrl(flashcardDeck[0].audioSrc) === flashcardAudioSrc
      ) {
        player.currentTime = 0;
        this.playAudio(audioNormal);
      } else {
        setFlashcardListCurrentIndex(index);
        this.playAudio(audioNormal);
        updateFlashcardItemIsPlaying(true);
      }
    }
    // if an individual item is clicked while play all is active, stop play all, reset the item index for play all to 0, and play the item clicked
    else if (flashcardListIsPlaying) {
      // if the item clicked is the same one that is currently playing, reset the audio element's currentTime to 0 before playing
      if (createFlashcardAudioUrl(audioNormal) === flashcardAudioSrc) {
        player.currentTime = 0;
      }

      //then play the item and reset the dialogue list playing trackers to their original state (play from beginning when the button is clicked again)
      this.playAudio(audioNormal);
      resetFlashcardListIsPlaying();
      setFlashcardListCurrentIndex(index);
    }
  };

  onFlashcardAudioEnded = () => {
    const {
      updateFlashcardItemIsPlaying,
      flashcardListIsPlaying,
      resetFlashcardListIndex,
    } = this.props;
    updateFlashcardItemIsPlaying(false);
    // if the list is not playing then set current index back to 0
    if (!flashcardListIsPlaying) resetFlashcardListIndex();
  };

  onFlashcardAudioPlayed = () => {
    const { updateFlashcardItemIsPlaying } = this.props;
    updateFlashcardItemIsPlaying(true);
  };

  // methods for playing and pausing the whole flashcard list

  // click event handler for playing/pausing all
  handlePlayPauseClicked = () => {
    const { flashcardItemIsPlaying, updateFlashcardListIsPlaying } = this.props;

    if (flashcardItemIsPlaying) {
      updateFlashcardListIsPlaying(false);
    } else {
      updateFlashcardListIsPlaying(true);
    }
  };

  // play an individual list item during play all
  flashcardListPlayItem = () => {
    const {
      flashcardDeck,
      flashcardListCurrentIndex,
      resetFlashcardListIndex,
      updateFlashcardListIsPlaying,
    } = this.props;

    if (flashcardListCurrentIndex !== -2) {
      this.playAudio(flashcardDeck[flashcardListCurrentIndex].normal);
    } else {
      resetFlashcardListIndex();
      updateFlashcardListIsPlaying(false);
    }
  };

  // increment the play all item index and then call the method that will play the next item
  flashcardListPlayNext = async () => {
    await this.incrementIndex();
    this.flashcardListPlayItem();
  };

  // method to exit flashcard list and open flashcard deck
  handleStartClick = () => {
    const { lessonId } = this.props.match.params;
    return this.props.history.push(routes.FLASHCARD_DECK.linkTo(lessonId));
  };

  render() {
    const {
      flashcardDeck,
      flashcardAudioSrc,
      flashcardListIsPlaying,
      flashcardItemIsPlaying,
      flashcardListCurrentIndex,
    } = this.props;

    if (!flashcardDeck) return null;

    return (
      <section className={styles.FlashcardList}>
        <PracticeList
          onItemClicked={(audioNormal, index) =>
            this.handleListItemClicked(audioNormal, index)
          }
          practiceMaterials={flashcardDeck}
          activeItemIndex={
            flashcardItemIsPlaying ? flashcardListCurrentIndex : null
          }
        >
          <Star className="icon star"/>
        </PracticeList>
        <audio
          id="flashcards-list-audio"
          src={flashcardAudioSrc}
          ref={this.player}
        />
        <footer className="footer-button-container">
          <SignalButton
            buttonType="neutral"
            click={this.handleStartClick}
          >
            <>
              <SVGIcon
                width={30}
                height={24}
                className="flashcards-icon"
                viewBox={flashcardsViewBox}
                d={flashcardsD}
              />
              <span className="button-text">
                Practice
              </span>
            </>
          </SignalButton>
          <PlayAllButton
            click={this.handlePlayPauseClicked}
            isListPlaying={flashcardListIsPlaying}
          />
        </footer>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  flashcardDeck: getFlashcardDeck(state),
  flashcardItemIsPlaying: getFlashcardItemIsPlaying(state),
  flashcardAudioSrc: getFlashcardAudioSrc(state),
  practiceAudioSpeed: getPracticeAudioSpeed(state),
  flashcardListIsPlaying: getFlashcardListIsPlaying(state),
  flashcardListCurrentIndex: getFlashcardListCurrentIndex(state),
});

const mapDispatchToProps = dispatch => ({
  loadFlashcardDeck: lessonId => dispatch(_loadFlashcardDeck(lessonId)),
  updateFlashcardAudioSrc: listItemId =>
    dispatch(_updateFlashcardAudioSrc(listItemId)),
  updateFlashcardItemIsPlaying: flashcardItemIsPlaying =>
    dispatch(_updateFlashcardItemIsPlaying(flashcardItemIsPlaying)),
  updateFlashcardListIsPlaying: flashcardListIsPlaying =>
    dispatch(_updateFlashcardListIsPlaying(flashcardListIsPlaying)),
  clearFlashcardSession: () => dispatch(_clearFlashcardSession()),
  incrementFlashcardListCurrentIndex: indexAndLength =>
    dispatch(_incrementFlashcardListCurrentIndex(indexAndLength)),
  setFlashcardListCurrentIndex: index =>
    dispatch(_setFlashcardListCurrentIndex(index)),
  resetFlashcardListIndex: () => dispatch(_resetFlashcardListIndex()),
  resetFlashcardListIsPlaying: () => dispatch(_resetFlashcardListIsPlaying()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashcardList);
