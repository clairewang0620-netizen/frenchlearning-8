/**
 * Handles Text-to-Speech functionality using the Web Speech API.
 * Prioritizes French voices for correct pronunciation.
 */
export const speakFrench = (text: string, rate: number = 0.9): void => {
  if (!('speechSynthesis' in window)) {
    alert('您的浏览器不支持语音播放，请使用最新版 Chrome 或 Safari。');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = rate; // Slightly slower for learning
  utterance.pitch = 1;

  // Attempt to select a high-quality French voice
  const voices = window.speechSynthesis.getVoices();
  const frenchVoice = voices.find(v => v.lang === 'fr-FR' && !v.localService) || // Try to find a cloud/enhanced voice
                      voices.find(v => v.lang.includes('fr')); // Fallback to any French

  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  window.speechSynthesis.speak(utterance);
};

// Pre-load voices to ensure they are available when needed (Chrome quirk)
if ('speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
}