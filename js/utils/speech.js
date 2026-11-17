// Web Speech API Wrapper: Speech Synthesis (TTS) & Speech Recognition (STT)

class SpeechController {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.preferredVoice = null;

    this.initRecognition();
    this.loadVoices();
  }

  loadVoices() {
    if (!this.synth) return;
    const updateVoices = () => {
      const voices = this.synth.getVoices();
      // Try to find English voice (India, UK, US)
      this.preferredVoice = 
        voices.find(v => v.lang.includes('en-IN')) ||
        voices.find(v => v.lang.includes('en-GB')) ||
        voices.find(v => v.lang.includes('en-US')) ||
        voices[0] || null;
    };

    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  isSpeechSupported() {
    return !!this.synth;
  }

  isMicSupported() {
    return !!this.recognition;
  }

  speak(text, onStart = () => {}, onEnd = () => {}) {
    if (!this.synth) {
      onEnd();
      return;
    }

    this.stopSpeaking();

    // Clean markdown code blocks from speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code snippet omitted for speech.')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*/g, '')
      .replace(/#/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      onEnd();
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  startListening(onTranscript, onError = () => {}, onEnd = () => {}) {
    if (!this.recognition) {
      onError('Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onTranscript(finalTranscript, interimTranscript);
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      this.isListening = false;
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.error(e);
      this.isListening = false;
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const speechController = new SpeechController();
