// This file demonstrates a useful API wrapper for the HTML5 MediaRecorder
// HOW TO USE:
// This creates an audio recorder API via a promise which resolves to an object with three attached functions:
// start() will begin recording sound from the device microphone
// clear() will clear the recorded sound (otherwise, repeatedly starting and stopping just adds to the existing audio blob)
// stop() returns a promise which resolves to two objects and two functions:
//   audioUrl is a string that provides URL encoded access hook to the recorded media
//   audioBlob is an object which can be saved to a file or database for later retrieval (the "sound file")
//   play() is will simply play the audio blob from browser memory
//   onAudioEnded(callback) is a tunnel to attach the onended event listener to the recorded audio, and give it the callback passed as an argument

// Import this file into your component or other file, giving it any arbitrary but appropriate name.
// In a React component, in componentDidMount or simliar React hook, create a recorder and attach it to the "this" object or state or whatever

// async componentDidMount() {
//   const recorder = await createAudioRecorder();
//   this.recorder = recorder;
// }

// startRecording = () => {
//    this.recorder.start();
//  };

//  stopRecording = async() => {
//    const audioResults = await this.recorder.stop();
//    audioResults.onAudioEnded(this.onRecordedAudioEnded);
//    audioResults.play();
//    this.setState({ isAudioPlaying: true });
//  };

//  onRecordedAudioEnded = () => {
//    this.recorder.clear();
//    this.setState({ isAudioPlayong: false });
//  }

const createAudioRecorder = () =>
  new Promise(async (resolve, reject) => {
    let stream = null,
      mediaRecorder = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      const { message } = e;
      return reject({ location: 'getUserMedia', message, e });
    }
    try {
      mediaRecorder = await new MediaRecorder(stream);
    } catch (e) {
      const { message } = e;
      return reject({ location: 'mediaRecorder', message, e });
    }
    const audioChunks = [];

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks);
          const hasAudio = audioBlob.size >= 1000;

          const audioUrl = hasAudio ? URL.createObjectURL(audioBlob) : null;
          const audio = hasAudio ? new Audio(audioUrl) : null;
          const play = hasAudio ? () => audio.play() : null;
          const onAudioEnded = callback => {
            if (hasAudio) {
              audio.onended = callback;
            }
          };

          resolve({ audioBlob, audioUrl, play, onAudioEnded });
        };
        mediaRecorder.stop();
      });

    const clear = () => {
      audioChunks.length = 0;
    };

    resolve({ start, stop, clear });
  });

export default createAudioRecorder;
