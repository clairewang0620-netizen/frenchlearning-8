/**
 * TTSManager
 * Handles Text-to-Speech functionality using the Web Speech API with MP3 fallback.
 */

interface SpeakOptions {
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  audio_mp3?: string | null; // Fallback URL
}

class TTSManager {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private audio: HTMLAudioElement | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    // Voices are loaded asynchronously in some browsers
    if (this.synth) {
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
      this.voices = this.synth.getVoices();
    }
  }

  /**
   * Attempts to speak the text using Web Speech API.
   * Falls back to HTML5 Audio if TTS fails or is unavailable AND mp3 is provided.
   */
  public speakText(text: string, options: SpeakOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      // 1. Cancel any current speaking
      this.cancel();

      // 2. Try Web Speech API
      if (this.synth) {
        // Find French Voice
        const frenchVoice = this.getFrenchVoice();
        
        // If we have a voice, use it
        if (frenchVoice) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.voice = frenchVoice;
          utterance.lang = 'fr-FR';
          utterance.rate = options.rate || 0.85; // Default slightly slower for learning
          utterance.pitch = options.pitch || 1;
          utterance.volume = options.volume || 1;

          utterance.onend = () => {
            resolve();
          };

          utterance.onerror = (e) => {
            console.warn('TTS SpeechSynthesis Error:', e);
            // If TTS fails, try fallback
            this.playFallback(options.audio_mp3, resolve, reject);
          };

          this.synth.speak(utterance);
          
          // Safari fix: sometimes onend doesn't fire if speech is short or interrupted
          // We resume just in case
          if (this.synth.paused) {
            this.synth.resume();
          }
          return;
        }
      }

      // 3. Fallback if no synth or no French voice
      console.warn('TTS not available or no French voice found. Using fallback.');
      this.playFallback(options.audio_mp3, resolve, reject);
    });
  }

  private getFrenchVoice(): SpeechSynthesisVoice | undefined {
    // Refresh voices if empty
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
    
    // Priority: Google French -> Microsoft French -> Apple French -> Any 'fr-FR' -> Any 'fr'
    return this.voices.find(v => v.lang === 'fr-FR' && v.name.includes('Google')) ||
           this.voices.find(v => v.lang === 'fr-FR' && !v.localService) ||
           this.voices.find(v => v.lang === 'fr-FR') ||
           this.voices.find(v => v.lang.includes('fr'));
  }

  private playFallback(mp3Url: string | null | undefined, resolve: () => void, reject: (reason?: any) => void) {
    if (!mp3Url) {
      reject('No TTS voice available and no MP3 fallback provided.');
      return;
    }

    try {
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      this.audio = new Audio(mp3Url);
      this.audio.onended = () => resolve();
      this.audio.onerror = (e) => reject(e);
      this.audio.play().catch(e => reject(e)); // Requires user interaction first
    } catch (e) {
      reject(e);
    }
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}

export const ttsManager = new TTSManager();