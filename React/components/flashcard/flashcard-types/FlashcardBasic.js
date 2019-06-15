import React, { useEffect, useState, useRef } from 'react';
import { PropTypes } from 'prop-types';

// REDUX CONNECTIONS
import { connect } from 'react-redux';
import { getFlashcardIsRevealed } from 'selectors/flashcardSelectors';
import { getPracticeAudioSpeed } from 'selectors/practiceSelectors';

import { FaMicrophone as Microphone } from 'react-icons/fa';
import {
  MdStar as Star,
  MdStarBorder as StarBorder,
  MdPlayArrow as Play,
  // MdBorderAll,
} from 'react-icons/md';
import { createFlashcardAudioUrl } from 'services/helpers/contentUrlGenerators';

// PROJECT COMPONENTS
import AudioSpeed from 'components/practice/practice-settings-subheader/audio-speed/AudioSpeed';
import PlayAudioCue from 'components/shared/UI/play-audio-cue/PlayAudioCue';

// MISC...
import styles from './FlashcardBasic.scss';
import createAudioRecorder from 'services/helpers/audioRecorder';
import CordovaRecorder from 'services/helpers/cordovaAudioRecorder';
import preventLongpressContextMenu from 'services/helpers/preventLongpressContextMenu';

// this component is using React Hooks
const FlashcardBasic = props => {
  const { isRevealed, audioSpeed, deckItem } = props;
  const { pinyin, characters, english, normal } = deckItem;

  // STATE
  const [audioResults, setAudioResults] = useState(null);
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // LOCAL VARS
  const audioRef = useRef();
  const isCordova = Boolean(window.cordova);
  let errorTimeout = null;

  // PLACEHOLDER VARS
  const isFavoriteSelected = true;
  useEffect(() => {
    createRecorder();
    return () => {
      if (errorTimeout) clearTimeout(errorTimeout);
    };
  }, []);

  useEffect(() => {
    resetAudio();
  }, [deckItem]);

  useEffect(() => {
    if (isRevealed) restartAudioPlaying();
  }, [isRevealed]);

  const restartAudioPlaying = async () => {
    await audioRef.current.endPlaying();
    const ref = audioRef.current;
    if (ref) ref.startPlaying();
  };

  const createRecorder = async () => {
    let recorder;
    try {
      recorder = isCordova
        ? new CordovaRecorder({ debug: true })
        : await createAudioRecorder();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error creating AudioRecorder.', e);
      const errorReporter = msg => {
        if (errorMessage) return;
        setErrorMessage(msg);
        errorTimeout = setTimeout(() => setErrorMessage(''), 3000);
      };

      recorder = {
        start: () => errorReporter('Unable to start recording.'),
        clear: () => errorReporter('unable to record.'),
        stop: () => {
          return {
            play: () => Promise.reject(errorReporter('Unable to play')),
          };
        },
      };
    }
    setAudioRecorder(recorder);
  };

  const handleRecorderButtonTouchStart = () => {
    if (audioResults) {
      audioResults.play();
    } else {
      audioRecorder.start(), setIsRecording(true);
    }
  };

  const handleRecorderButtonTouchEnd = async () => {
    preventLongpressContextMenu();
    if (audioResults) return;
    const newAudioResults = isCordova
      ? audioRecorder.stop()
      : await audioRecorder.stop();
    setIsRecording(false);
    setAudioResults(newAudioResults);
    newAudioResults.play();
  };

  const handleResetButtonTouchStart = async () => {
    setAudioResults(null);
    audioRecorder.clear();
  };

  const resetAudio = () => {
    if (audioResults && isCordova) audioResults.clear();
    if (audioRecorder) audioRecorder.clear();
    setAudioResults(null);
  };

  const hasAudioResults = audioResults !== null;

  const mainClasses = [styles.FlashcardBasic];
  if (!isRevealed) mainClasses.push('hide');

  const starClasses = ['star', 'unhidable'];
  if (isFavoriteSelected) starClasses.push('star-active');

  const recorderClasses = ['audio-record-button'];
  recorderClasses.push(hasAudioResults ? 'play-icon' : 'microphone-icon');
  recorderClasses.push(isRecording ? 'recording' : null);

  const recorderButton = (
    <button
      className={recorderClasses.join(' ')}
      onTouchStart={handleRecorderButtonTouchStart}
      onTouchEnd={handleRecorderButtonTouchEnd}
    >
      {hasAudioResults ? <Play /> : <Microphone />}
    </button>
  );

  const resetButton = (
    <h2
      className="audio-subheader text-link"
      onTouchStart={handleResetButtonTouchStart}
    >
      Press here to re-record.
    </h2>
  );

  const audioSrc = createFlashcardAudioUrl(`${normal}.mp3`);

  return (
    <section className={mainClasses.join(' ')}>
      <div className="item element">
        <PlayAudioCue
          src={audioSrc}
          ref={audioRef}
          audioSpeed={audioSpeed}
          backgroundColor={'light-grey'}
        />
      </div>
      <div className="audio-speed-container">
        <AudioSpeed hasTitle={false} />
      </div>
      <button className={starClasses.join(' ')}>
        {isFavoriteSelected ? <Star /> : <StarBorder />}
      </button>
      <div className="pinyin item unhidable">
        <div className="item element" />
        <div className="item element">{pinyin}</div>
        <div className="item element" />
      </div>
      <p className="character item unhidable">{characters}</p>
      <p className="english item">{english}</p>
      {recorderButton}
      {errorMessage ? (
        <h2 className="audio-subheader error">{errorMessage}</h2>
      ) : hasAudioResults ? (
        resetButton
      ) : (
        <h2 className="audio-subheader">Press and hold to record.</h2>
      )}
    </section>
  );
};

FlashcardBasic.propTypes = {
  deckItem: PropTypes.object.isRequired,
  isRevealed: PropTypes.bool,
  audioSpeed: PropTypes.number,
};

const mapStateToProps = state => ({
  isRevealed: getFlashcardIsRevealed(state),
  audioSpeed: getPracticeAudioSpeed(state),
});

export default connect(mapStateToProps)(FlashcardBasic);
